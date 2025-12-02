import {
  RSVPRequest,
  RSVPResponse,
  GiftDTO,
  ReserveGiftRequest,
  GiftActionRequest,
  ApiResponse,
  ReservationData,
  FrontendEventType,
  mapEventTypeToApi,
} from '@/types/api';

// API Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper function to build full URL
const buildUrl = (endpoint: string): string => `${API_BASE_URL}${endpoint}`;

// Helper function to handle API errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.message || error.error || `Erro: ${response.status}`);
    }
    throw new Error(`Erro: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const apiClient = {
  // RSVP endpoints
  async submitRSVPCasamento(data: { nome_completo: string; contato: string; mensagem?: string }): Promise<RSVPResponse> {
    const request: RSVPRequest = {
      nomeCompleto: data.nome_completo,
      contato: data.contato,
      mensagem: data.mensagem,
    };
    const response = await fetch(buildUrl('/api/v1/rsvp/casamento'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<RSVPResponse>(response);
  },

  async submitRSVPChaPanela(data: { nome_completo: string; contato: string; mensagem?: string }): Promise<RSVPResponse> {
    const request: RSVPRequest = {
      nomeCompleto: data.nome_completo,
      contato: data.contato,
      mensagem: data.mensagem,
    };
    const response = await fetch(buildUrl('/api/v1/rsvp/cha-panela'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<RSVPResponse>(response);
  },

  // Gift endpoints
  async getGifts(tipo: FrontendEventType): Promise<GiftDTO[]> {
    try {
      const eventType = mapEventTypeToApi(tipo);
      const response = await fetch(buildUrl(`/api/v1/gifts/${eventType}`));
      return handleResponse<GiftDTO[]>(response);
    } catch (error) {
      console.error('Erro ao buscar presentes:', error);
      return []; // Return empty array instead of throwing
    }
  },

  async reserveGift(data: {
    giftId: string;
    tipo: FrontendEventType;
    name: string;
    phone: string;
  }): Promise<ApiResponse<ReservationData>> {
    const request: ReserveGiftRequest = {
      giftId: parseInt(data.giftId, 10),
      tipo: mapEventTypeToApi(data.tipo),
      name: data.name,
      phone: data.phone,
    };
    const response = await fetch(buildUrl('/api/v1/gifts/reserve'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<ApiResponse<ReservationData>>(response);
  },

  async markGiftPurchased(data: {
    giftId: string;
    tipo: FrontendEventType;
    code: string;
  }): Promise<ApiResponse> {
    const request: GiftActionRequest = {
      giftId: parseInt(data.giftId, 10),
      tipo: mapEventTypeToApi(data.tipo),
      code: data.code,
    };
    const response = await fetch(buildUrl('/api/v1/gifts/mark-purchased'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<ApiResponse>(response);
  },

  async cancelReservation(data: {
    giftId: string;
    tipo: FrontendEventType;
    code: string;
  }): Promise<ApiResponse> {
    const request: GiftActionRequest = {
      giftId: parseInt(data.giftId, 10),
      tipo: mapEventTypeToApi(data.tipo),
      code: data.code,
    };
    const response = await fetch(buildUrl('/api/v1/gifts/cancel-reservation'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<ApiResponse>(response);
  },
};