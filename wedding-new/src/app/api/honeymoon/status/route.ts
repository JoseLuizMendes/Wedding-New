import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { HoneymoonRepository } from '@/repositories/honeymoon/HoneymoonRepository';
import { HoneymoonService } from '@/services/honeymoon/HoneymoonService';

/**
 * GET /api/honeymoon/status
 * Returns the current status of the honeymoon goal
 */
export async function GET() {
  const startTime = Date.now();

  try {
    console.log('[API /honeymoon/status] Request received');

    // Initialize repository and service with dependency injection
    const honeymoonRepository = new HoneymoonRepository(prisma);
    const honeymoonService = new HoneymoonService(honeymoonRepository);

    // Calculate progress
    const progress = await honeymoonService.calculateProgress();

    const duration = Date.now() - startTime;
    console.log(`[API /honeymoon/status] Request completed in ${duration}ms`);

    return NextResponse.json(progress);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[API /honeymoon/status] Request failed after ${duration}ms:`,
      {
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
              }
            : String(error),
      }
    );

    return NextResponse.json(
      { error: 'Erro ao buscar status da meta. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
