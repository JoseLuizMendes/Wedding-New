import { PrismaClient } from '@/generated/prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createPrismaClient = () => new PrismaClient({} as any);

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
