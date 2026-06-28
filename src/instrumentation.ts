/**
 * Next.js Instrumentation Hook
 * Runs once when the Node.js server starts (or per cold-start on Vercel).
 * Swaps the global Prisma client to use Turso when TURSO_DATABASE_URL is set.
 */

export async function register() {
  const tursoUrl = process.env.TURSO_DATABASE_URL

  if (!tursoUrl) return // Local dev — use standard SQLite

  try {
    const { PrismaLibSql } = await import('@prisma/adapter-libsql')
    const { createClient } = await import('@libsql/client')

    const libsql = createClient({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })

    const adapter = new PrismaLibSql(libsql)
    const tursoClient = new (await import('@prisma/client')).PrismaClient({ adapter })

    // Replace the global Prisma singleton that db.ts Proxy reads from
    const g = globalThis as unknown as { prisma: unknown }
    g.prisma = tursoClient

    console.log('[instrumentation] Turso database client initialized')
  } catch (err) {
    console.error('[instrumentation] Failed to initialize Turso client:', err)
  }
}