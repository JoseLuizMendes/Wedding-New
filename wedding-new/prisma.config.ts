import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  
  // Configuration for migrations and db push
  migrate: {
    adapter: async () => {
      const { Pool, neonConfig } = await import('@neondatabase/serverless');
      const { PrismaNeon } = await import('@prisma/adapter-neon');
      const ws = await import('ws');
      
      neonConfig.webSocketConstructor = ws.default;
      
      const connectionString = process.env.DATABASE_URL!;
      const pool = new Pool({ connectionString });
      
      return new PrismaNeon(pool);
    },
  },
});
