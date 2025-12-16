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
    console.log('[Webhook /mercadopago] Notification received');

    // Verify webhook signature
    const isValidSignature = await verifyMercadoPagoSignature(request);

    if (!isValidSignature) {
      console.error('[Webhook /mercadopago] Invalid signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    console.log('[Webhook /mercadopago] Event type:', type);

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

    console.log('[Webhook /mercadopago] Payment details:', {
      id: payment.id,
      status: payment.status,
      external_reference: payment.external_reference,
      preference_id: payment.additional_info?.items?.[0]?.id,
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
  additional_info?: {
    items?: Array<{ id?: string }>;
  };
}

async function handleMercadoPagoPayment(payment: MercadoPagoPaymentData) {
  const { external_reference, metadata, transaction_amount, payer, id, status } =
    payment;
  
  if (!id || !transaction_amount) {
    throw new Error('Invalid payment data: missing id or transaction_amount');
  }
  
  const transactionId = id.toString();
  const preferenceId = payment.additional_info?.items?.[0]?.id;

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
      // Try to approve existing pending contribution first
      if (preferenceId) {
        try {
          await honeymoonRepository.approveContribution(
            preferenceId,
            transactionId
          );
          console.log(
            `[Webhook] Honeymoon contribution approved: ${transaction_amount} from ${contributorName}`
          );
          return;
        } catch (error) {
          console.log(
            '[Webhook] No pending contribution found, creating new approved contribution'
          );
          // Fall through to create new contribution
        }
      }

      // If no pending contribution exists, create approved one directly
      await honeymoonService.processContribution(
        transaction_amount,
        transactionId,
        contributorName
      );

      console.log(
        `[Webhook] Honeymoon contribution processed: ${transaction_amount} from ${contributorName}`
      );
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
