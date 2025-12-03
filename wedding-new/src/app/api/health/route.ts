import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { version as prismaVersion } from '@prisma/client/package.json';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      prismaVersion
    });
  } catch (error) {
    console.error('[Health Check] Database connection failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
