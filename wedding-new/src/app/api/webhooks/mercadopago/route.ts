import { NextRequest, NextResponse } from 'next/server';
import {
  mercadoPagoPayment,
  verifyMercadoPagoSignature,
} from '@/lib/mercado-pago';
import prisma from '@/lib/prisma';
import { HoneymoonRepository } from '@/repositories/honeymoon/HoneymoonRepository';
import { HoneymoonService } from '@/services/honeymoon/HoneymoonService';
import { GiftRepository } from '@/repositories/gifts/GiftRepository';

/**
 * POST /api/webhooks/mercadopago
 * Handle Mercado Pago webhook notifications
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log('='.repeat(80));
    console.log('[Webhook /mercadopago] 🔔 WEBHOOK NOTIFICATION RECEIVED');
    console.log('[Webhook /mercadopago] Headers:', Object.fromEntries(request.headers));
    console.log('='.repeat(80));

    const body = await request.json();
    console.log('[Webhook /mercadopago] Body received:', JSON.stringify(body, null, 2));
    
    const { type, data } = body;

    console.log('[Webhook /mercadopago] Event type:', type);
    console.log('[Webhook /mercadopago] Payment ID:', data?.id);

    // TODO: Re-enable signature verification after testing
    // const isValidSignature = await verifyMercadoPagoSignature(request);
    // if (!isValidSignature) {
    //   console.error('[Webhook /mercadopago] Invalid signature');
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Only process payment events
    if (type !== 'payment') {
      console.log('[Webhook /mercadopago] Ignoring non-payment event');
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    // Validate data.id exists
    if (!data?.id) {
      console.error('[Webhook /mercadopago] Missing payment ID');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Get full payment details from Mercado Pago API
    const payment = await mercadoPagoPayment.get({ id: data.id });

    // Log completo do payment para debug
    console.log('[Webhook /mercadopago] FULL PAYMENT OBJECT:', JSON.stringify(payment, null, 2));

    console.log('[Webhook /mercadopago] Payment details:', {
      id: payment.id,
      status: payment.status,
      external_reference: payment.external_reference,
      preference_id: (payment as any).preference_id,
    });

    // Handle payment based on status
    await handleMercadoPagoPayment(payment);

    const duration = Date.now() - startTime;
    console.log(`[Webhook /mercadopago] Processed in ${duration}ms`);

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[Webhook /mercadopago] Request failed after ${duration}ms:`,
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

    // Return 200 to prevent Mercado Pago from retrying
    // Log the error for manual review
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}

/**
 * Extract contributor name from payment data
 */
function getContributorName(
  metadata?: { contributor_name?: string },
  payer?: { first_name?: string; email?: string }
): string {
  return (
    metadata?.contributor_name ||
    payer?.first_name ||
    payer?.email ||
    'Anonymous'
  );
}

/**
 * Handle payment based on external_reference and metadata
 */
interface MercadoPagoPaymentData {
  id?: number;
  external_reference?: string;
  status?: string;
  preference_id?: string;
  metadata?: {
    contributor_name?: string;
    type?: string;
    event_type?: string;
  };
  transaction_amount?: number;
  payer?: {
    first_name?: string;
    email?: string;
  };
}

async function handleMercadoPagoPayment(payment: MercadoPagoPaymentData) {
  const { external_reference, metadata, transaction_amount, payer, id, status, preference_id } =
    payment;
  
  if (!id || !transaction_amount) {
    throw new Error('Invalid payment data: missing id or transaction_amount');
  }
  
  const transactionId = id.toString();
  const preferenceId = preference_id;

  console.log('[Webhook] Processing payment:', {
    transactionId,
    external_reference,
    metadata,
    amount: transaction_amount,
    status,
    preferenceId,
  });

  // Determine if this is a honeymoon contribution
  const isHoneymoon =
    external_reference?.startsWith('cota_') ||
    external_reference?.startsWith('pix_') ||
    metadata?.type === 'honeymoon';

  if (isHoneymoon) {
    // Process honeymoon contribution
    console.log('[Webhook] Processing honeymoon contribution');

    const honeymoonRepository = new HoneymoonRepository(prisma);
    const honeymoonService = new HoneymoonService(honeymoonRepository);

    const contributorName = getContributorName(metadata, payer);

    // Handle based on payment status
    if (status === 'approved') {
      console.log('[Webhook] Payment approved, attempting to update contribution');
      
      let contributionUpdated = false;

      // Try 1: Approve by preferenceId
      if (preferenceId) {
        try {
          await honeymoonRepository.approveContribution(
            preferenceId,
            transactionId
          );
          console.log(
            `[Webhook] Contribution approved via preferenceId: ${transaction_amount} from ${contributorName}`
          );
          contributionUpdated = true;
        } catch (error) {
          console.log(
            `[Webhook] Could not approve via preferenceId: ${error instanceof Error ? error.message : error}`
          );
        }
      }

      // Try 2: Check if contribution exists with this exact transactionId (already processed)
      if (!contributionUpdated) {
        try {
          const existing = await honeymoonRepository.getContributionByTransactionId(transactionId);
          if (existing && existing.paymentStatus === 'approved') {
            console.log(`[Webhook] Contribution already approved (idempotency check)`);
            contributionUpdated = true;
          }
        } catch (error) {
          console.log(`[Webhook] Error checking existing contribution: ${error}`);
        }
      }

      // Try 3: Create new approved contribution
      if (!contributionUpdated) {
        try {
          await honeymoonService.processContribution(
            transaction_amount,
            transactionId,
            contributorName
          );
          console.log(
            `[Webhook] New approved contribution created: ${transaction_amount} from ${contributorName}`
          );
          contributionUpdated = true;
        } catch (error) {
          console.error(
            `[Webhook] Failed to create contribution: ${error instanceof Error ? error.message : error}`
          );
        }
      }

      if (!contributionUpdated) {
        console.error('[Webhook] Failed to process approved payment - manual review needed');
      }
    } else if (['rejected', 'cancelled', 'refunded'].includes(status || '')) {
      // Delete pending contribution
      if (preferenceId) {
        await honeymoonRepository.deletePendingContribution(preferenceId);
        console.log(
          `[Webhook] Pending contribution deleted for preference ${preferenceId}`
        );
      }
    } else {
      console.log(
        `[Webhook] Payment ${transactionId} not processed, status: ${status}`
      );
    }
  } else {
    // Process physical gift purchase
    console.log('[Webhook] Processing physical gift purchase');

    if (!external_reference) {
      console.warn('[Webhook] No external_reference for gift purchase, skipping');
      return;
    }

    const giftRepository = new GiftRepository(prisma);

    // Determine event type from external_reference or metadata
    // This assumes the gift_id contains the actual gift UUID
    const giftId = external_reference;
    const eventTypeRaw = metadata?.event_type || 'casamento';
    const eventType = (eventTypeRaw === 'cha-panela' ? 'cha-panela' : 'casamento') as 'casamento' | 'cha-panela';
    
    const contributorName = getContributorName(metadata, payer);

    try {
      await giftRepository.markAsPurchasedByTransaction(
        giftId,
        eventType,
        transactionId,
        contributorName
      );

      console.log(`[Webhook] Gift ${giftId} marked as purchased with transaction ${transactionId}`);
    } catch (error) {
      console.error('[Webhook] Error marking gift as purchased:', error);
      // Don't throw - we've already received the payment
      // Log for manual review
    }
  }
}
