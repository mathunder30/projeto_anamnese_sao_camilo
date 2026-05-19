import dotenv from "dotenv";
import mysql from "mysql2/promise";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  }

  return value;
}

const DB_HOST = getRequiredEnv("DB_HOST");
const DB_USER = getRequiredEnv("DB_USER");
const DB_PASSWORD = getRequiredEnv("DB_PASSWORD");
const DB_NAME = getRequiredEnv("DB_NAME");

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(process.env.DB_PORT ?? 3306),
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
  queueLimit: 0,
});

async function connectDB(): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.ping();
    console.log("Banco de dados conectado com sucesso.");
  } finally {
    connection.release();
  }
}

export { pool, connectDB };
