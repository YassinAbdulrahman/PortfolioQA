import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Database client — works in both local dev (SQLite) and Vercel (Turso).
 *
 * Local dev: standard PrismaClient with SQLite file.
 * Production: instrumentation.ts replaces globalForPrisma.prisma
 *            with a Turso-backed client before any API route runs.
 *
 * The Proxy ensures every call checks the latest client reference,
 * so the Turso swap is transparent to all API routes.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient()
    }
    const client = globalForPrisma.prisma
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(client)
    }
    return value
  },
})