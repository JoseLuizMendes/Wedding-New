import { NextRequest, NextResponse } from 'next/server';
import {
  mercadoPagoPayment,
  verifyMercadoPagoSignature,
} from '@/lib/mercado-pago';
import prisma from '@/lib/prisma';
import { HoneymoonRepository } from '@/repositories/honeymoon/HoneymoonRepository';
import { HoneymoonService } from '@/services/honeymoon/HoneymoonService';
import { GiftRepository } from '@/repositories/gifts/GiftRepository';
import { GiftService } from '@/services/gifts/GiftService';

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
    });

    // Only process approved payments
    if (payment.status !== 'approved' && !payment.date_approved) {
      console.log(
        `[Webhook /mercadopago] Payment ${payment.id} not approved yet, status: ${payment.status}`
      );
      return NextResponse.json({ status: 'pending' }, { status: 200 });
    }

    // Handle the payment based on type
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
 * Handle payment based on external_reference and metadata
 */
async function handleMercadoPagoPayment(payment: any) {
  const { external_reference, metadata, transaction_amount, payer, id } =
    payment;
  const transactionId = id.toString();

  console.log('[Webhook] Processing payment:', {
    transactionId,
    external_reference,
    metadata,
    amount: transaction_amount,
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

    const contributorName =
      metadata?.contributor_name ||
      payer?.first_name ||
      payer?.email ||
      'Anonymous';

    await honeymoonService.processContribution(
      transaction_amount,
      transactionId,
      contributorName
    );

    console.log(
      `[Webhook] Honeymoon contribution processed: ${transaction_amount} from ${contributorName}`
    );
  } else {
    // Process physical gift purchase
    console.log('[Webhook] Processing physical gift purchase');

    const giftRepository = new GiftRepository(prisma);
    const giftService = new GiftService(giftRepository);

    // Determine event type from external_reference or metadata
    // This assumes the gift_id contains the actual gift UUID
    // You may need to adjust this based on how gift_id is structured
    const giftId = external_reference;
    const eventType = metadata?.event_type || 'casamento'; // Default to casamento

    try {
      await giftService.markAsPurchased({
        giftId,
        tipo: eventType,
        code: transactionId, // Using transaction ID as code
      });

      console.log(`[Webhook] Gift ${giftId} marked as purchased`);
    } catch (error) {
      console.error('[Webhook] Error marking gift as purchased:', error);
      // Don't throw - we've already received the payment
      // Log for manual review
    }
  }
}
