import { Pool, PoolConfig } from "pg";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from "./variables";

const options: PoolConfig = {
  host: DB_HOST || "",
  database: DB_NAME || "",
  user: DB_USERNAME || "",
  password: DB_PASSWORD || "",
  port: Number(DB_PORT) || 0,
};

const db = new Pool(options);

export default db;
