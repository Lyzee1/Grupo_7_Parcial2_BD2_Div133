// db.js — abre la conexión a MongoDB.
// La cadena de conexión se lee del archivo .env (que NO se sube al repositorio).
import 'dotenv/config';
import { MongoClient } from 'mongodb';

export async function conectar() {
  const uri = process.env.MONGODB_URI;
  const nombreBase = process.env.DB_NAME || 'tienda_electronica';

  if (!uri) {
    throw new Error('Falta MONGODB_URI. Copiá .env.example como .env y completalo.');
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(nombreBase);

  // Devolvemos el client (para poder cerrarlo) y la base (para consultar)
  return { client, db };
}
