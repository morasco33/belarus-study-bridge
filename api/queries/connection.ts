import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>> | null = null;
let dbAvailable = false;

export function getDb() {
  if (instance) return instance;

  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL not set");
  }

  try {
    const pool = mysql.createPool({
      uri: env.databaseUrl,
      connectionLimit: 10,
      connectTimeout: 10000,
    });
    instance = drizzle(pool, {
      mode: "planetscale",
      schema: fullSchema,
    });
    dbAvailable = true;
    return instance;
  } catch (e) {
    console.error("Database connection failed:", (e as Error).message);
    throw e;
  }
}

export function isDbAvailable() {
  return dbAvailable;
}
