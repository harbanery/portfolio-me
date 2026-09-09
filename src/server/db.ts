import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton — same pattern as progress-self. Keeping one
 * PrismaClient on `globalThis` means development hot reloads reuse the
 * existing connection instead of opening a new one per reload.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  // Connect eagerly so the connection is ready before the first query.
  client.$connect().catch((err) => {
    console.error("[prisma] initial connection failed:", err);
  });
  return client;
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Graceful shutdown: close the Prisma connection when the process ends.
 * Prevents leaked (stale) connections that trigger "Server has closed
 * the connection" on the next reload.
 */
for (const signal of ["beforeExit", "SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    prisma.$disconnect().catch(() => {});
  });
}
