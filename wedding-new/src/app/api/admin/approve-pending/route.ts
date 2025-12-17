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

    // Buscar todas as contribuições pendentes
    const pendingContributions = await prisma.contribution.findMany({
      where: { paymentStatus: 'pending' },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`[Admin] Found ${pendingContributions.length} pending contributions`);

    const results = [];

    for (const contribution of pendingContributions) {
      try {
        // Extrair o payment ID do transactionId
        // Formato: "pending-3052968825-preference_id"
        const match = contribution.transactionId.match(/pending-(\d+)-/);
        
        if (!match) {
          console.log(`[Admin] Could not extract payment ID from ${contribution.transactionId}`);
          results.push({
            id: contribution.id,
            status: 'skipped',
            reason: 'Invalid transaction ID format',
          });
          continue;
        }

        const paymentId = match[1];
        console.log(`[Admin] Checking payment ${paymentId}...`);

        // Consultar o pagamento no Mercado Pago
        const payment = await mercadoPagoPayment.get({ id: parseInt(paymentId) });

        console.log(`[Admin] Payment ${paymentId} status: ${payment.status}`);

        if (payment.status === 'approved') {
          // Aprovar a contribuição
          if (contribution.mercadoPagoPreferenceId) {
            await honeymoonRepository.approveContribution(
              contribution.mercadoPagoPreferenceId,
              payment.id!.toString()
            );
          } else {
            // Se não tem preferenceId, atualizar manualmente
            await prisma.$transaction(async (tx) => {
              await tx.contribution.update({
                where: { id: contribution.id },
                data: {
                  paymentStatus: 'approved',
                  transactionId: payment.id!.toString(),
                },
              });

              await tx.honeymoonGoal.update({
                where: { id: contribution.honeymoonId },
                data: {
                  currentAmount: {
                    increment: Number(contribution.amount),
                  },
                },
              });
            });
          }

          console.log(`[Admin] ✅ Contribution ${contribution.id} approved`);
          results.push({
            id: contribution.id,
            status: 'approved',
            amount: Number(contribution.amount),
          });
        } else if (['rejected', 'cancelled', 'refunded'].includes(payment.status || '')) {
          // Deletar a contribuição
          await prisma.contribution.delete({
            where: { id: contribution.id },
          });

          console.log(`[Admin] ❌ Contribution ${contribution.id} deleted (payment ${payment.status})`);
          results.push({
            id: contribution.id,
            status: 'deleted',
            reason: payment.status,
          });
        } else {
          console.log(`[Admin] ⏳ Payment ${paymentId} still ${payment.status}`);
          results.push({
            id: contribution.id,
            status: 'still_pending',
            paymentStatus: payment.status,
          });
        }
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
