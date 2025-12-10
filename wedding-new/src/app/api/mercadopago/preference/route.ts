import { NextRequest, NextResponse } from 'next/server';
import { mercadoPagoPreference } from '@/lib/mercado-pago';

/**
 * POST /api/mercadopago/preference
 * Create a Mercado Pago payment preference
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log('[API /mercadopago/preference] Request received');

    // Check if Mercado Pago is configured
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error('[API /mercadopago/preference] MERCADOPAGO_ACCESS_TOKEN not configured');
      return NextResponse.json(
        { error: 'Mercado Pago não está configurado. Configure MERCADOPAGO_ACCESS_TOKEN nas variáveis de ambiente.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { amount, title, gift_id, contributor_name } = body;

    // Validate required fields
    if (!amount || !title || !gift_id) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: amount, title, gift_id' },
        { status: 400 }
      );
    }

    // Determine if this is a honeymoon contribution or a physical gift
    const isHoneymoon =
      gift_id.startsWith('cota_') || gift_id.startsWith('pix_');

    // Create preference
    const preference = await mercadoPagoPreference.create({
      body: {
        items: [
          {
            id: gift_id,
            title: title,
            quantity: 1,
            unit_price: parseFloat(amount),
            currency_id: 'BRL',
          },
        ],
        external_reference: gift_id,
        metadata: {
          gift_id,
          type: isHoneymoon ? 'honeymoon' : 'gift',
          contributor_name: contributor_name || null,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/casamento?payment=success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/casamento?payment=failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/casamento?payment=pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhooks/mercadopago`,
      },
    });

    const duration = Date.now() - startTime;
    console.log(
      `[API /mercadopago/preference] Preference created in ${duration}ms:`,
      preference.id
    );

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[API /mercadopago/preference] Request failed after ${duration}ms:`,
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
      { error: 'Erro ao criar preferência de pagamento. Tente novamente.' },
      { status: 500 }
    );
  }
}
