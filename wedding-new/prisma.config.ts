import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  
  // Configuration for migrations and db push
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
