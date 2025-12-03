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
      // Use internal Next.js API route
      const response = await fetch(`/api/gifts/${tipo}`);
      if (!response.ok) throw new Error('Erro ao buscar presentes');
      return response.json();
    } catch (error) {
      // Log error for debugging but return empty array to prevent UI breakage
      console.error('Erro ao buscar presentes:', error);
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
