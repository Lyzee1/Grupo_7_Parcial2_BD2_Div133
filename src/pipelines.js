// pipelines.js — las consultas de agregación (aggregation pipelines).
// Todas arrancan en la colección "pedidos".
// Cada pipeline es un arreglo de etapas: la salida de una etapa es la entrada de la siguiente.

// ---------------------------------------------------------------------
// 1) Facturación por categoría de producto
//    Pregunta: ¿cuánta plata generó cada categoría (sin contar cancelados)?
//    $match -> $unwind -> $lookup -> $unwind -> $group -> $project -> $sort
// ---------------------------------------------------------------------
export const facturacionPorCategoria = [
  // Dejamos afuera los pedidos cancelados (el $match va primero: menos documentos para las etapas siguientes)
  { $match: { estado: { $ne: 'cancelado' } } },

  // Un documento por cada item del pedido
  { $unwind: '$items' },

  // Traemos el producto de cada item para saber su categoría (el lookup devuelve un ARRAY)
  { $lookup: {
      from: 'productos',
      localField: 'items.productoId',
      foreignField: '_id',
      as: 'producto'
  } },

  // Como el lookup devuelve un array de un elemento, lo desarmamos
  { $unwind: '$producto' },

  // Agrupamos por categoría y sumamos precio x cantidad
  { $group: {
      _id: '$producto.categoria',
      facturacion: { $sum: { $multiply: ['$items.precio', '$items.cantidad'] } },
      unidades: { $sum: '$items.cantidad' }
  } },

  // Mostramos "categoria" en lugar de "_id"
  { $project: { _id: 0, categoria: '$_id', unidades: 1, facturacion: 1 } },

  // De mayor a menor facturación
  { $sort: { facturacion: -1 } }
];

// ---------------------------------------------------------------------
// 2) Top 5 clientes
//    Pregunta: ¿quiénes gastaron más en pedidos entregados?
//    $match -> $unwind -> $group -> $sort -> $limit -> $lookup -> $unwind -> $project
// ---------------------------------------------------------------------
export const top5Clientes = [
  { $match: { estado: 'entregado' } },
  { $unwind: '$items' },

  // Un grupo por cliente: sumamos lo gastado y las unidades compradas
  { $group: {
      _id: '$clienteId',
      totalGastado: { $sum: { $multiply: ['$items.precio', '$items.cantidad'] } },
      unidadesCompradas: { $sum: '$items.cantidad' }
  } },

  // Mayor gasto primero (si hay empate, por _id para que el resultado sea siempre el mismo)
  { $sort: { totalGastado: -1, _id: 1 } },
  { $limit: 5 },

  // Recién ahora traemos los datos del cliente: solo para los 5 que quedaron
  { $lookup: {
      from: 'clientes',
      localField: '_id',
      foreignField: '_id',
      as: 'cliente'
  } },
  { $unwind: '$cliente' },

  { $project: {
      _id: 0,
      cliente: { $concat: ['$cliente.nombre', ' ', '$cliente.apellido'] },
      ciudad: '$cliente.direccion.ciudad',
      totalGastado: 1,
      unidadesCompradas: 1
  } }
];

// ---------------------------------------------------------------------
// 3) Productos más vendidos
//    Pregunta: ¿qué productos se vendieron más (en unidades)?
//    $match -> $unwind -> $group -> $sort -> $limit -> $project
//    No hace falta $lookup: el nombre del producto está EMBEBIDO en cada item.
// ---------------------------------------------------------------------
export const productosMasVendidos = [
  { $match: { estado: { $ne: 'cancelado' } } },
  { $unwind: '$items' },
  { $group: { _id: '$items.nombre', unidades: { $sum: '$items.cantidad' } } },
  { $sort: { unidades: -1, _id: 1 } },
  { $limit: 5 },
  { $project: { _id: 0, producto: '$_id', unidades: 1 } }
];

// ---------------------------------------------------------------------
// 4) Extra: pedidos por ciudad
//    Pregunta: ¿de qué ciudades salen más pedidos?
//    $lookup -> $unwind -> $sortByCount -> $project
//    Usa un dato EMBEBIDO en el cliente (direccion.ciudad).
// ---------------------------------------------------------------------
export const pedidosPorCiudad = [
  { $lookup: {
      from: 'clientes',
      localField: 'clienteId',
      foreignField: '_id',
      as: 'cliente'
  } },
  { $unwind: '$cliente' },

  // $sortByCount = $group (contando) + $sort descendente, en una sola etapa
  { $sortByCount: '$cliente.direccion.ciudad' },

  { $project: { _id: 0, ciudad: '$_id', pedidos: '$count' } }
];
