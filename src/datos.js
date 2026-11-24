// datos.js — genera los documentos de ejemplo (seed).
// No usamos números al azar: todo se arma con bucles y el operador % (resto),
// así cada corrida del seed carga EXACTAMENTE los mismos documentos.
// Los precios están en pesos argentinos y son datos de ejemplo (ficticios).

// ---------------------------------------------------------------------
// PRODUCTOS (36): 6 categorías x 6 productos.
// "especificaciones" es un subdocumento EMBEBIDO. Cada categoría tiene
// campos distintos: es el esquema flexible de MongoDB.
// ---------------------------------------------------------------------
export function generarProductos() {
  const lista = [
    // Auriculares
    { categoria: 'Auriculares', marca: 'JBL', nombre: 'JBL Tune 520BT', precio: 62000, stock: 40, especificaciones: { tipo: 'on-ear', autonomiaHoras: 57 } },
    { categoria: 'Auriculares', marca: 'Sony', nombre: 'Sony WH-CH520', precio: 78000, stock: 35, especificaciones: { tipo: 'on-ear', autonomiaHoras: 50 } },
    { categoria: 'Auriculares', marca: 'Samsung', nombre: 'Samsung Galaxy Buds FE', precio: 95000, stock: 28, especificaciones: { tipo: 'in-ear', autonomiaHoras: 30 } },
    { categoria: 'Auriculares', marca: 'Apple', nombre: 'Apple AirPods 4', precio: 250000, stock: 15, especificaciones: { tipo: 'in-ear', autonomiaHoras: 30 } },
    { categoria: 'Auriculares', marca: 'Xiaomi', nombre: 'Xiaomi Redmi Buds 6 Play', precio: 28000, stock: 60, especificaciones: { tipo: 'in-ear', autonomiaHoras: 36 } },
    { categoria: 'Auriculares', marca: 'Logitech', nombre: 'Logitech G435 Gamer', precio: 75000, stock: 22, especificaciones: { tipo: 'diadema', autonomiaHoras: 18 } },

    // Tablets
    { categoria: 'Tablets', marca: 'Samsung', nombre: 'Samsung Galaxy Tab A9+ 64GB', precio: 280000, stock: 18, especificaciones: { pantallaPulgadas: 11, almacenamientoGB: 64 } },
    { categoria: 'Tablets', marca: 'Apple', nombre: 'Apple iPad 10ma gen 64GB', precio: 620000, stock: 10, especificaciones: { pantallaPulgadas: 10.9, almacenamientoGB: 64 } },
    { categoria: 'Tablets', marca: 'Xiaomi', nombre: 'Xiaomi Redmi Pad SE 128GB', precio: 260000, stock: 25, especificaciones: { pantallaPulgadas: 11, almacenamientoGB: 128 } },
    { categoria: 'Tablets', marca: 'Lenovo', nombre: 'Lenovo Tab M10 64GB', precio: 190000, stock: 20, especificaciones: { pantallaPulgadas: 10.1, almacenamientoGB: 64 } },
    { categoria: 'Tablets', marca: 'Samsung', nombre: 'Samsung Galaxy Tab S9 FE 128GB', precio: 520000, stock: 8, especificaciones: { pantallaPulgadas: 10.9, almacenamientoGB: 128 } },
    { categoria: 'Tablets', marca: 'Huawei', nombre: 'Huawei MatePad SE 128GB', precio: 240000, stock: 12, especificaciones: { pantallaPulgadas: 11, almacenamientoGB: 128 } },

    // Smartwatches
    { categoria: 'Smartwatches', marca: 'Apple', nombre: 'Apple Watch SE 40mm', precio: 420000, stock: 9, especificaciones: { resistenteAgua: true, autonomiaDias: 1 } },
    { categoria: 'Smartwatches', marca: 'Samsung', nombre: 'Samsung Galaxy Watch6 40mm', precio: 380000, stock: 14, especificaciones: { resistenteAgua: true, autonomiaDias: 2 } },
    { categoria: 'Smartwatches', marca: 'Xiaomi', nombre: 'Xiaomi Redmi Watch 4', precio: 95000, stock: 45, especificaciones: { resistenteAgua: true, autonomiaDias: 20 } },
    { categoria: 'Smartwatches', marca: 'Amazfit', nombre: 'Amazfit Bip 5', precio: 85000, stock: 30, especificaciones: { resistenteAgua: true, autonomiaDias: 10 } },
    { categoria: 'Smartwatches', marca: 'Huawei', nombre: 'Huawei Watch Fit 3', precio: 160000, stock: 16, especificaciones: { resistenteAgua: true, autonomiaDias: 10 } },
    { categoria: 'Smartwatches', marca: 'Garmin', nombre: 'Garmin Forerunner 55', precio: 330000, stock: 6, especificaciones: { resistenteAgua: true, autonomiaDias: 14 } },

    // Celulares
    { categoria: 'Celulares', marca: 'Samsung', nombre: 'Samsung Galaxy A15 128GB', precio: 260000, stock: 50, especificaciones: { almacenamientoGB: 128, ramGB: 4 } },
    { categoria: 'Celulares', marca: 'Samsung', nombre: 'Samsung Galaxy S24 256GB', precio: 1250000, stock: 7, especificaciones: { almacenamientoGB: 256, ramGB: 8 } },
    { categoria: 'Celulares', marca: 'Apple', nombre: 'Apple iPhone 15 128GB', precio: 1300000, stock: 5, especificaciones: { almacenamientoGB: 128, ramGB: 6 } },
    { categoria: 'Celulares', marca: 'Xiaomi', nombre: 'Xiaomi Redmi Note 13 256GB', precio: 340000, stock: 38, especificaciones: { almacenamientoGB: 256, ramGB: 8 } },
    { categoria: 'Celulares', marca: 'Motorola', nombre: 'Motorola Moto G54 256GB', precio: 280000, stock: 33, especificaciones: { almacenamientoGB: 256, ramGB: 8 } },
    { categoria: 'Celulares', marca: 'Motorola', nombre: 'Motorola Edge 40 Neo 256GB', precio: 520000, stock: 11, especificaciones: { almacenamientoGB: 256, ramGB: 12 } },

    // Parlantes
    { categoria: 'Parlantes', marca: 'JBL', nombre: 'JBL Flip 6', precio: 180000, stock: 20, especificaciones: { resistenteAgua: true, autonomiaHoras: 12 } },
    { categoria: 'Parlantes', marca: 'JBL', nombre: 'JBL Go 3', precio: 60000, stock: 55, especificaciones: { resistenteAgua: true, autonomiaHoras: 5 } },
    { categoria: 'Parlantes', marca: 'Sony', nombre: 'Sony SRS-XB100', precio: 90000, stock: 26, especificaciones: { resistenteAgua: true, autonomiaHoras: 16 } },
    { categoria: 'Parlantes', marca: 'Bose', nombre: 'Bose SoundLink Flex', precio: 230000, stock: 9, especificaciones: { resistenteAgua: true, autonomiaHoras: 12 } },
    { categoria: 'Parlantes', marca: 'Xiaomi', nombre: 'Xiaomi Mi Portable 30W', precio: 70000, stock: 32, especificaciones: { resistenteAgua: true, autonomiaHoras: 13 } },
    { categoria: 'Parlantes', marca: 'Edifier', nombre: 'Edifier R1280DB', precio: 150000, stock: 13, especificaciones: { resistenteAgua: false, autonomiaHoras: 0 } },

    // Accesorios
    { categoria: 'Accesorios', marca: 'Samsung', nombre: 'Cargador Samsung 25W', precio: 22000, stock: 80, especificaciones: { tipo: 'cargador', compatibleCon: 'USB-C' } },
    { categoria: 'Accesorios', marca: 'Anker', nombre: 'Cable USB-C a USB-C 1m', precio: 12000, stock: 120, especificaciones: { tipo: 'cable', compatibleCon: 'USB-C' } },
    { categoria: 'Accesorios', marca: 'Xiaomi', nombre: 'Power Bank Xiaomi 10000 mAh', precio: 35000, stock: 48, especificaciones: { tipo: 'bateria externa', compatibleCon: 'USB-C' } },
    { categoria: 'Accesorios', marca: 'Genérico', nombre: 'Funda de silicona universal', precio: 15000, stock: 90, especificaciones: { tipo: 'funda', compatibleCon: 'celulares' } },
    { categoria: 'Accesorios', marca: 'Genérico', nombre: 'Vidrio templado universal', precio: 8000, stock: 150, especificaciones: { tipo: 'protector de pantalla', compatibleCon: 'celulares' } },
    { categoria: 'Accesorios', marca: 'Genérico', nombre: 'Soporte de celular para auto', precio: 14000, stock: 70, especificaciones: { tipo: 'soporte', compatibleCon: 'celulares' } },
  ];

  // Le agregamos el _id legible: prod01, prod02, ...
  for (let i = 0; i < lista.length; i++) {
    lista[i]._id = 'prod' + String(i + 1).padStart(2, '0');
  }
  return lista;
}

// CLIENTES (40). "direccion" es un subdocumento EMBEBIDO.
export function generarClientes() {
  const nombres = ['Juan', 'Ana', 'Lucas', 'María', 'Mateo', 'Sofía', 'Diego', 'Valentina'];
  const apellidos = ['García', 'López', 'Pérez', 'Gómez', 'Díaz'];
  const ciudades = ['Quilmes', 'Avellaneda', 'Lanús', 'Bernal'];

  const clientes = [];
  for (let i = 1; i <= 40; i++) {
    clientes.push({
      _id: i,
      nombre: nombres[i % 8],
      apellido: apellidos[i % 5],
      email: 'cliente' + i + '@mail.com',
      direccion: {
        calle: 'Calle ' + i,
        ciudad: ciudades[i % 4],
      },
    });
  }
  return clientes;
}

// PEDIDOS (150).
//  - clienteId y productoId son REFERENCIAS.
//  - "items" es un arreglo EMBEBIDO; cada item COPIA nombre y precio del producto.
export function generarPedidos(clientes, productos) {
  const estados = ['entregado', 'enviado', 'cancelado'];

  const pedidos = [];
  for (let i = 1; i <= 150; i++) {
    const cliente = clientes[i % 40];
    const producto1 = productos[i % 36];
    const producto2 = productos[(i + 1) % 36];   // el producto siguiente de la lista

    pedidos.push({
      _id: i,
      clienteId: cliente._id,
      fecha: new Date(2026, i % 12, 15),         // los meses empiezan en 0
      estado: estados[i % 3],
      items: [
        { productoId: producto1._id, nombre: producto1.nombre, precio: producto1.precio, cantidad: 1 },
        { productoId: producto2._id, nombre: producto2.nombre, precio: producto2.precio, cantidad: 2 },
      ],
    });
  }
  return pedidos;
}