import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma';

// For serverless environment (Vercel), @neondatabase/serverless uses fetch natively
// Only configure WebSocket for local Node.js environment
if (typeof WebSocket === 'undefined') {
  const ws = require('ws');
  neonConfig.webSocketConstructor = ws;
}

// Use DATABASE_URL from environment, or a dummy URL for build time
const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/db';

// Create adapter with connection string
const adapter = new PrismaNeon({ connectionString });

// Singleton pattern to avoid multiple instances in dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
