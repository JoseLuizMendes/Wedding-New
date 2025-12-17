import { NextRequest, NextResponse } from 'next/server';
import { mercadoPagoPreference } from '@/lib/mercado-pago';
import { prisma } from '@/lib/prisma';
import { HoneymoonRepository } from '@/repositories/honeymoon/HoneymoonRepository';

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
        success: `${baseUrl}/pagamento/resultado?status=success`,
        failure: `${baseUrl}/pagamento/resultado?status=failure`,
        pending: `${baseUrl}/pagamento/resultado?status=pending`,
      };
      preferenceBody.auto_return = 'approved';
      preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
      
      console.log('[API /mercadopago/preference] Webhook URL configured:', `${baseUrl}/api/webhooks/mercadopago`);
    } else {
      console.warn('[API /mercadopago/preference] ⚠️ No webhook URL - localhost or invalid baseUrl');
    }
    
    const preference = await mercadoPagoPreference.create({
      body: preferenceBody,
    });

    // If honeymoon contribution, create pending contribution
    if (isHoneymoon) {
      try {
        const honeymoonRepository = new HoneymoonRepository(prisma);
        await honeymoonRepository.createPendingContribution({
          amount: parseFloat(amount),
          contributorName: contributor_name || null,
          mercadoPagoPreferenceId: preference.id!,
        });
        console.log(
          `[API /mercadopago/preference] Pending contribution created for preference ${preference.id}`
        );
      } catch (error) {
        console.error(
          '[API /mercadopago/preference] Error creating pending contribution:',
          error
        );
        // Don't fail the request if contribution creation fails
        // The webhook will handle it if needed
      }
    }

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
