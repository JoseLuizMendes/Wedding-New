'use client';

/**
 * Hook for Mercado Pago integration
 * Provides methods to create checkout sessions
 */
export function useMercadoPago() {
  /**
   * Create a Mercado Pago checkout and redirect to payment page
   * @param checkoutData - Data for creating the preference
   */
  async function createMercadoPagoCheckout(checkoutData: {
    amount: number;
    title: string;
    gift_id: string;
    contributor_name?: string;
  }) {
    try {
      console.log('[useMercadoPago] Creating checkout:', checkoutData);

      const response = await fetch('/api/mercadopago/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar preferência de pagamento');
      }

      const { init_point } = await response.json();

      console.log('[useMercadoPago] Redirecting to:', init_point);

      // Redirect to Mercado Pago checkout
      window.location.href = init_point;
    } catch (error) {
      console.error('[useMercadoPago] Error:', error);
      throw error;
    }
  }

  return { createMercadoPagoCheckout };
}
