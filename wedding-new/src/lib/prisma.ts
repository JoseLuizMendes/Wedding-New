import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma';

// For serverless environment (Vercel), @neondatabase/serverless uses fetch natively
// Only configure WebSocket for local Node.js environment (not available in edge/serverless)
if (typeof WebSocket === 'undefined') {
  try {
    const ws = require('ws');
    neonConfig.webSocketConstructor = ws;
  } catch (e) {
    // ws module not available or not needed in serverless environment
  }
}

// Use DATABASE_URL from environment, or a placeholder for build-time static analysis
// Note: The placeholder is only used during build; runtime always requires DATABASE_URL
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/placeholder';

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
