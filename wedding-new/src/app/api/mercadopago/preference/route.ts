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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
    const isLocalhost = !baseUrl || baseUrl.includes('localhost');
    
    console.log('[API /mercadopago/preference] Base URL:', baseUrl || 'localhost (auto_return disabled)');
    
    const preferenceBody: any = {
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
    };

    // Only add back_urls and auto_return if we have a valid public URL
    // Mercado Pago doesn't accept localhost URLs
    if (!isLocalhost && baseUrl) {
      preferenceBody.back_urls = {
        success: `${baseUrl}/casamento?payment=success`,
        failure: `${baseUrl}/casamento?payment=failure`,
        pending: `${baseUrl}/casamento?payment=pending`,
      };
      preferenceBody.auto_return = 'approved';
      preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
    }
    
    const preference = await mercadoPagoPreference.create({
      body: preferenceBody,
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
    
    // Log detalhado do erro
    const errorDetails = error instanceof Error 
      ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
          cause: (error as any).cause
        }
      : error;
    
    console.error(
      `[API /mercadopago/preference] Request failed after ${duration}ms:`,
      JSON.stringify(errorDetails, null, 2)
    );

    return NextResponse.json(
      { error: 'Erro ao criar preferência de pagamento. Tente novamente.' },
      { status: 500 }
    );
  }
}
