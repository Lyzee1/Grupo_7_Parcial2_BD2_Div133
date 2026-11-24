# Tienda de electrónica con MongoDB

Grupo 7 — Div133 - Integrantes: Elias Rocca, Moreno Ramiro

## Qué hace

Programa en Node.js que se conecta a MongoDB y guarda los clientes, los productos y los pedidos de una tienda de electrónica.

Con esos datos responde cuatro preguntas del negocio usando aggregation pipelines:

1. ¿Cuánto facturó cada categoría de producto?
2. ¿Quiénes son los 5 clientes que más gastaron?
3. ¿Cuáles son los 5 productos más vendidos?
4. ¿De qué ciudades salen más pedidos? _(extra)_

## Cómo ejecutarlo

Requisitos: Node.js 22 y una base MongoDB (local o Atlas).

```bash
cd tienda_electronica_mongo

npm install                # instala mongodb y dotenv
cp .env.example .env       # completar MONGODB_URI (en Windows: copy .env.example .env)
npm run seed               # borra y carga los datos de ejemplo
npm run consultas          # ejecuta los 4 pipelines y muestra los resultados (también: npm start)
```

**Archivo `.env`**

- MongoDB local: `MONGODB_URI=mongodb://localhost:27017`
- `DB_NAME=tienda_electronica` (nombre de la base; se crea sola al insertar).

## Colecciones

| Colección | Documentos | Qué guarda |
|---|---|---|
| `clientes` | 40 | Datos del cliente y su dirección (embebida) |
| `productos` | 36 | Catálogo: 6 categorías x 6 productos |
| `pedidos` | 150 | Compras: referencian al cliente y a los productos |

### `clientes`

```js
{
  _id: 'cli04',
  nombre: 'María',
  apellido: 'García',
  email: 'cliente04@mail.com',
  direccion: { calle: 'Rivadavia', numero: 511, ciudad: 'Lomas de Zamora' }   // embebida
}
```

### `productos`

```js
{
  _id: 'prod20',
  categoria: 'Celulares',
  marca: 'Samsung',
  nombre: 'Samsung Galaxy S24 256GB',
  precio: 1250000,
  stock: 7,
  especificaciones: { almacenamientoGB: 256, ramGB: 8 }   // embebida; cambia según la categoría
}
```

### `pedidos`

```js
{
  _id: 'ped001',
  clienteId: 'cli01',                         // referencia a clientes._id
  fecha: ISODate('2026-01-01T12:00:00Z'),
  estado: 'entregado',                        // entregado | enviado | cancelado
  items: [                                    // embebidos
    { productoId: 'prod01', nombre: 'JBL Tune 520BT', precio: 62000, cantidad: 1 }
  ]
}
```

## Modelo

```
 clientes                                  productos
 ┌──────────────────────────┐              ┌──────────────────────────────┐
 │ _id                      │              │ _id                          │
 │ nombre, apellido, email  │              │ categoria, marca, nombre     │
 │ direccion { ... }        │ ← embebida   │ precio, stock                │
 └────────────┬─────────────┘              │ especificaciones { ... }     │ ← embebida
              │ 1                          └──────────────┬───────────────┘
              │                                           │ 1
              │ N                                         │ N
 ┌────────────┴───────────────────────────────────────────┴───────────────┐
 │ pedidos                                                                │
 │ _id, fecha, estado                                                     │
 │ clienteId  ─────────────► referencia a clientes._id                    │
 │ items [ { productoId ──► referencia a productos._id,                   │
 │           nombre, precio, cantidad } ]            ← embebidos          │
 └────────────────────────────────────────────────────────────────────────┘
```

Relaciones entre las 3 colecciones: **cliente 1 → N pedidos** (`pedidos.clienteId`) y **producto N ↔ M pedido** (`pedidos.items.productoId`; el pedido guarda los items embebidos y cada item referencia al producto).

## Justificación del diseño

| Relación | Tipo | ¿Limitado? | Decisión | Por qué |
|---|---|---|---|---|
| Cliente → dirección | 1 a 1 | Sí, una | **Embebida** | Se lee siempre con el cliente y es chica. |
| Producto → especificaciones | 1 a 1 | Sí, una | **Embebida** | Se muestran siempre con el producto. Cada categoría tiene campos distintos (esquema flexible). |
| Cliente → pedidos | 1 a N | **Sin límite** | **Referencia** (`clienteId` en el pedido) | Un cliente compra toda la vida: adentro del cliente el documento crecería sin parar. |
| Pedido → items | 1 a N | Sí, chico (1 a 3) | **Embebidos** | Un item solo tiene sentido dentro de su pedido y se leen juntos. |
| Producto ↔ pedido | N a M | Sin límite (un producto está en miles de pedidos) | **Referencia** (`items.productoId`) | El pedido apunta al producto; el producto no guarda sus pedidos. |

**¿Y si fuera relacional?** Serían 6 tablas (`clientes`, `direcciones`, `productos`, `especificaciones`, `pedidos`, `items_pedido`) con claves foráneas.

- **Ganaríamos:** integridad referencial (la base no deja guardar un pedido de un cliente que no existe; MongoDB no lo controla, lo debe cuidar la aplicación) y un esquema fijo.
- **Perderíamos:** la lectura en un solo paso (para ver un pedido con sus items haría falta un `JOIN`) y la flexibilidad de las especificaciones: una tabla con columnas para auriculares, tablets y celulares tendría muchas columnas vacías.

## Consultas

| Consulta | Para qué sirve | Etapas |
|---|---|---|
| Facturación por categoría | Saber qué categoría vende más plata | `$match` → `$unwind` → `$lookup` → `$unwind` → `$group` → `$project` → `$sort` |
| Top 5 clientes | Identificar a los mejores clientes | `$match` → `$unwind` → `$group` → `$sort` → `$limit` → `$lookup` → `$unwind` → `$project` |
| Productos más vendidos | Saber qué reponer primero | `$match` → `$unwind` → `$group` → `$sort` → `$limit` → `$project` |
| Pedidos por ciudad _(extra)_ | Ver de dónde vienen las compras | `$lookup` → `$unwind` → `$sortByCount` → `$project` |

Los pipelines están en [`src/pipelines.js`](src/pipelines.js), con un comentario en cada etapa.
