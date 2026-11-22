import { attachDatabasePool } from "@vercel/functions";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client";
import { normalizePostgresSslMode } from "./connection";

const globalForDb = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
  poolErrorBound?: boolean;
};

function getPool() {
  if (globalForDb.pool) return globalForDb.pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL est absent. Ajoutez-le dans .env.local.");
  }
  const pool = new Pool({
    connectionString: normalizePostgresSslMode(connectionString),
    max: 5,
    keepAlive: true,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
  });
  attachDatabasePool(pool);
  globalForDb.pool = pool;
  return pool;
}
function createPrismaClient() {
  return new PrismaClient({ adapter: new PrismaPg(getPool()) });
}

const cachedPrisma = globalForDb.prisma;
export const db =
  process.env.NODE_ENV !== "production" && cachedPrisma instanceof PrismaClient
    ? cachedPrisma
    : createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForDb.prisma = db;

if (!globalForDb.poolErrorBound && globalForDb.pool) {
  globalForDb.pool.on("error", (error: Error) => {
    console.error("Connexion Postgres fermée. La prochaine requête en ouvrira une nouvelle.", error.message);
  });
  globalForDb.poolErrorBound = true;
}
