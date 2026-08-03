import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

console.log("Connecting to DB host:", process.env.DB_HOST, "port:", process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

export default pool;
