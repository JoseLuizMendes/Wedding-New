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
    
    // TODO: SECURITY - Implement proper HMAC-SHA256 signature verification
    // Current implementation is simplified for development
    // WARNING: This MUST be implemented before production deployment
    
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('[MercadoPago] MERCADOPAGO_WEBHOOK_SECRET not configured');
      // In development, allow webhooks without signature verification
      // IMPORTANT: Never deploy to production with this setting
      return process.env.NODE_ENV === 'development';
    }

    // TODO: Implement HMAC verification:
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //   .createHmac('sha256', webhookSecret)
    //   .update(requestBody + xRequestId)
    //   .digest('hex');
    // return crypto.timingSafeEqual(
    //   Buffer.from(xSignature),
    //   Buffer.from(expectedSignature)
    // );
    
    // Temporary: just check that headers are present
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
  return process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '';
}
