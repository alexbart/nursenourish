import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel Project Settings → Environment Variables."
    );
  }

  // Hosted Postgres (Neon/Supabase/Vercel) requires TLS. pg v8 treats
  // 'require' as 'verify-full', which fails against the Supabase pooler's
  // self-signed chain, so we use 'no-verify' to skip CA verification.
  let connectionString = databaseUrl;
  if (databaseUrl.includes("localhost")) {
    // local dev without TLS
  } else if (!databaseUrl.includes("sslmode=")) {
    connectionString = `${databaseUrl}${databaseUrl.includes("?") ? "&" : "?"}sslmode=no-verify`;
  } else {
    connectionString = databaseUrl.replace(/sslmode=(require|verify-ca|verify-full)/i, "sslmode=no-verify");
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "production"
        ? ["error", "warn"]
        : ["query", "info", "warn", "error"],
  });
}

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Lazy proxy: client is created on first DB use, not at module import time
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
