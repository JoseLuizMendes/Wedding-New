import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma';
import ws from 'ws';

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

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
