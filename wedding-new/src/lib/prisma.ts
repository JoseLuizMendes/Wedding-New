import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma';

// For serverless environment (Vercel), @neondatabase/serverless uses fetch natively
// Only configure WebSocket for local Node.js environment (not available in edge/serverless)
if (typeof WebSocket === 'undefined') {
  try {
    const ws = require('ws');
    neonConfig.webSocketConstructor = ws;
    console.log('[Prisma] WebSocket constructor set for Node.js environment');
  } catch (e) {
    console.log('[Prisma] WebSocket module not available (serverless environment)');
  }
}

// Use DATABASE_URL from environment, or a placeholder for build-time static analysis
// Note: The placeholder is only used during build; runtime always requires DATABASE_URL
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/placeholder';

if (!process.env.DATABASE_URL) {
  console.warn('[Prisma] DATABASE_URL not set, using placeholder for build');
}

// Create adapter with connection string
const adapter = new PrismaNeon({ connectionString });

// Singleton pattern to avoid multiple instances in dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

console.log(`[Prisma] Client initialized (env: ${process.env.NODE_ENV})`);

export default prisma;
