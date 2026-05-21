import mysql from "mysql2/promise";
import { getRequiredEnv } from "./env";

export const promisePool = mysql.createPool({
  host: getRequiredEnv("DB_HOST"),
  user: getRequiredEnv("DB_USER"),
  password: getRequiredEnv("DB_PASSWORD"),
  database: getRequiredEnv("DB_NAME"),
  port: Number(process.env.DB_PORT ?? 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = promisePool;
