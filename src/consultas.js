// consultas.js — ejecuta los 4 pipelines y muestra los resultados por consola.
// Se ejecuta con:  npm run consultas   (o npm start)
import { conectar } from './db.js';
import {
  facturacionPorCategoria,
  top5Clientes,
  productosMasVendidos,
  pedidosPorCiudad
} from './pipelines.js';

async function main() {
  const { client, db } = await conectar();

  try {
    const pedidos = db.collection('pedidos');

    // Si no hay datos, avisamos en lugar de mostrar tablas vacías
    const cantidad = await pedidos.countDocuments();
    if (cantidad === 0) {
      console.log('No hay datos. Primero ejecutá:  npm run seed');
      return;
    }

    // Las 4 consultas son independientes: las lanzamos en paralelo con Promise.all
    const [porCategoria, topClientes, masVendidos, porCiudad] = await Promise.all([
      pedidos.aggregate(facturacionPorCategoria).toArray(),
      pedidos.aggregate(top5Clientes).toArray(),
      pedidos.aggregate(productosMasVendidos).toArray(),
      pedidos.aggregate(pedidosPorCiudad).toArray()
    ]);

    console.log('\n1) Facturación por categoría (sin pedidos cancelados)');
    console.table(porCategoria);

    console.log('\n2) Top 5 clientes (pedidos entregados)');
    console.table(topClientes);

    console.log('\n3) Los 5 productos más vendidos (en unidades)');
    console.table(masVendidos);

    console.log('\n4) Pedidos por ciudad (extra)');
    console.table(porCiudad);
  } catch (error) {
    console.error('Error al ejecutar las consultas:', error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
