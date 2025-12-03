import {
  FrontendEventType,
  Gift,
} from '@/types/api';

export type EventType = FrontendEventType;
export type GiftStatus = 'available' | 'reserved' | 'bought';

// Re-export Gift type for backward compatibility
export type { Gift };

export interface ReserveGiftRequest {
  giftId: string;
  tipo: EventType;
  name: string;
  phone: string;
}

export interface GiftActionRequest {
  giftId: string;
  tipo: EventType;
  code: string;
}

export interface GiftActionResponse {
  success: boolean;
  message: string;
  accessCode?: string;
}

export const giftsApi = {
  /**
   * Fetch gifts by event type using Next.js internal API routes.
   * Returns an empty array on error to prevent UI breakage.
   * Errors are logged to console for debugging.
   */
  async getByEvent(tipo: EventType): Promise<Gift[]> {
    try {
      // Normalize tipo to lowercase for consistency
      const normalizedTipo = tipo.toLowerCase();
      const apiUrl = `/api/gifts/${normalizedTipo}`;
      
      console.log(`[GiftsAPI] Fetching gifts for tipo: ${tipo} (normalized: ${normalizedTipo})`);
      
      // Use internal Next.js API route
      const response = await fetch(apiUrl);
      
      console.log(`[GiftsAPI] Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Erro ao buscar presentes';
        let responseBody = '';
        
        try {
          // First, try to read as text to see what we got
          responseBody = await response.text();
          console.log(`[GiftsAPI] Response body (text):`, responseBody);
          
          // Then try to parse as JSON
          const errorData = JSON.parse(responseBody);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error(`[GiftsAPI] Failed to parse error response as JSON:`, {
            parseError: parseError instanceof Error ? parseError.message : String(parseError),
            responseBody: responseBody.substring(0, 500), // First 500 chars
            contentType: response.headers.get('content-type')
          });
        }
        
        const detailedError = new Error(`${errorMessage} (Status: ${response.status})`);
        console.error(`[GiftsAPI] Request failed:`, {
          url: apiUrl,
          tipo,
          normalizedTipo,
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          errorMessage
        });
        
        throw detailedError;
      }
      
      const gifts = await response.json();
      console.log(`[GiftsAPI] Successfully fetched ${gifts.length} gifts for tipo: ${tipo}`);
      return gifts;
    } catch (error) {
      // Log detailed error for debugging but return empty array to prevent UI breakage
      console.error('[GiftsAPI] Error in getByEvent:', {
        tipo,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : String(error),
        timestamp: new Date().toISOString()
      });
      return [];
    }
  },

  async reserve(data: ReserveGiftRequest): Promise<GiftActionResponse> {
    const request = {
      giftId: data.giftId,
      tipo: data.tipo,
      name: data.name,
      phone: data.phone,
    };
    const response = await fetch('/api/gifts/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const result = await response.json();
    return {
      success: result.success,
      message: result.message,
      accessCode: result.data?.reservationCode,
    };
  },

  async markAsPurchased(data: GiftActionRequest): Promise<GiftActionResponse> {
    const request = {
      giftId: data.giftId,
      tipo: data.tipo,
      code: data.code,
    };
    const response = await fetch('/api/gifts/mark-purchased', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const result = await response.json();
    return {
      success: result.success,
      message: result.message,
    };
  },

  async cancelReservation(data: GiftActionRequest): Promise<GiftActionResponse> {
    const request = {
      giftId: data.giftId,
      tipo: data.tipo,
      code: data.code,
    };
    const response = await fetch('/api/gifts/cancel-reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const result = await response.json();
    return {
      success: result.success,
      message: result.message,
    };
  },
};
