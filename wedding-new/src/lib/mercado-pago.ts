import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Initialize Mercado Pago SDK
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';

if (!accessToken) {
  console.warn(
    '[MercadoPago] MERCADOPAGO_ACCESS_TOKEN not configured. Mercado Pago functionality will be disabled.'
  );
}

const client = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
  },
});

// Export configured clients
export const mercadoPagoPayment = new Payment(client);
export const mercadoPagoPreference = new Preference(client);

/**
 * Verify Mercado Pago webhook signature
 * @param request - Next.js request object
 * @returns boolean indicating if signature is valid
 */
export async function verifyMercadoPagoSignature(
  request: Request
): Promise<boolean> {
  try {
    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');

    if (!xSignature || !xRequestId) {
      console.warn('[MercadoPago] Missing signature headers');
      return false;
    }

    // For production, implement proper signature verification
    // https://www.mercadopago.com.br/developers/en/docs/your-integrations/notifications/webhooks#editor_3
    
    // For now, we'll check if the webhook secret is configured
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('[MercadoPago] MERCADOPAGO_WEBHOOK_SECRET not configured');
      // In development, allow webhooks without signature verification
      return process.env.NODE_ENV === 'development';
    }

    // TODO: Implement proper HMAC signature verification
    // For now, just check that headers are present
    return true;
  } catch (error) {
    console.error('[MercadoPago] Error verifying signature:', error);
    return false;
  }
}

/**
 * Get public key for frontend SDK
 */
export function getMercadoPagoPublicKey(): string {
  return process.env.MERCADOPAGO_PUBLIC_KEY || '';
}
