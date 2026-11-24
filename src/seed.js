// seed.js — borra y vuelve a cargar los datos de ejemplo.
// Se ejecuta con:  npm run seed
import { conectar } from './db.js';
import { generarClientes, generarProductos, generarPedidos } from './datos.js';

async function main() {
  const { client, db } = await conectar();

  try {
    const clientes = generarClientes();
    const productos = generarProductos();
    const pedidos = generarPedidos(clientes, productos);

    // 1) Vaciamos las colecciones (así el seed se puede correr muchas veces)
    await db.collection('clientes').deleteMany({});
    await db.collection('productos').deleteMany({});
    await db.collection('pedidos').deleteMany({});

    // 2) Cargamos todo con insertMany (una sola ida y vuelta por colección)
    const rClientes = await db.collection('clientes').insertMany(clientes);
    const rProductos = await db.collection('productos').insertMany(productos);
    const rPedidos = await db.collection('pedidos').insertMany(pedidos);

    // 3) Índices
    //    - email único: no puede haber dos clientes con el mismo email
    //    - pedidos.clienteId: acelera "los pedidos de un cliente"
    await db.collection('clientes').createIndex({ email: 1 }, { unique: true });
    await db.collection('pedidos').createIndex({ clienteId: 1 });

    console.log('Seed terminado:');
    console.log('  clientes :', rClientes.insertedCount);
    console.log('  productos:', rProductos.insertedCount);
    console.log('  pedidos  :', rPedidos.insertedCount);
  } catch (error) {
    console.error('Error al cargar los datos:', error.message);
    process.exitCode = 1;
  } finally {
    // Se cierra SIEMPRE, haya habido error o no
    await client.close();
  }
}


main();
