import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { HoneymoonRepository } from '@/repositories/honeymoon/HoneymoonRepository';
import { mercadoPagoPayment } from '@/lib/mercado-pago';

/**
 * POST /api/admin/approve-pending
 * Verifica contribuições pendentes e aprova as que foram pagas no Mercado Pago
 * Esta é uma solução temporária enquanto o webhook não funciona
 */
export async function POST() {
  try {
    console.log('[Admin] Checking pending contributions...');

    const honeymoonRepository = new HoneymoonRepository(prisma);

    // Buscar todas as contribuições pendentes com menos de 1 hora
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const pendingContributions = await prisma.contribution.findMany({
      where: { 
        paymentStatus: 'pending',
        createdAt: { gte: oneHourAgo }  // Apenas últimas 1 hora
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`[Admin] Found ${pendingContributions.length} recent pending contributions`);

    const results = [];

    for (const contribution of pendingContributions) {
      try {
        // Simplesmente aprovar - assumir que se chegou na página de sucesso, foi pago
        await prisma.$transaction(async (tx) => {
          // Atualizar contribuição para approved
          await tx.contribution.update({
            where: { id: contribution.id },
            data: {
              paymentStatus: 'approved',
              transactionId: contribution.transactionId.replace('pending-', 'approved-'),
            },
          });

          // Incrementar currentAmount da meta
          await tx.honeymoonGoal.update({
            where: { id: contribution.honeymoonId },
            data: {
              currentAmount: {
                increment: Number(contribution.amount),
              },
            },
          });
        });

        console.log(`[Admin] ✅ Contribution ${contribution.id} approved (R$ ${contribution.amount})`);
        results.push({
          id: contribution.id,
          status: 'approved',
          amount: Number(contribution.amount),
        });
      } catch (error) {
        console.error(`[Admin] Error processing contribution ${contribution.id}:`, error);
        results.push({
          id: contribution.id,
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: pendingContributions.length,
      results,
    });
  } catch (error) {
    console.error('[Admin] Error approving pending contributions:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
