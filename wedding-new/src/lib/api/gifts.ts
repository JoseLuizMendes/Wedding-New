import { api } from './index';
import {
  FrontendEventType,
  GiftDTO,
  ApiResponse,
  ReservationData,
  mapEventTypeToApi,
} from '@/types/api';

export type EventType = FrontendEventType;
export type GiftStatus = 'available' | 'reserved' | 'bought';

// Legacy Gift interface for backward compatibility with existing components
export interface Gift {
  id: string;
  nome: string;
  descricao: string | null;
  link_externo: string;
  reservado: boolean;
  ordem: number;
  reserved_until: string | null;
  is_bought: boolean;
  reserved_by: string | null;
  reserved_phone_display: string | null;
  reserved_at: string | null;
  purchased_at: string | null;
  imagem: string | null;
}

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

// Helper function to map GiftDTO to legacy Gift format
function mapGiftDTOToLegacy(dto: GiftDTO): Gift {
  return {
    id: String(dto.id),
    nome: dto.name,
    descricao: dto.description,
    link_externo: '', // Not provided by new API
    reservado: dto.status === 'RESERVED',
    ordem: 0, // Not provided by new API
    reserved_until: null, // Not provided by new API
    is_bought: dto.status === 'PURCHASED',
    reserved_by: null, // Not provided by new API
    reserved_phone_display: null, // Not provided by new API
    reserved_at: null, // Not provided by new API
    purchased_at: null, // Not provided by new API
    imagem: dto.imageUrl,
  };
}

export const giftsApi = {
  /**
   * Fetch gifts by event type.
   * Returns an empty array on error to prevent UI breakage.
   * Errors are logged to console for debugging.
   */
  async getByEvent(tipo: EventType): Promise<Gift[]> {
    try {
      const eventType = mapEventTypeToApi(tipo);
      const dtos = await api.get<GiftDTO[]>(`/api/v1/gifts/${eventType}`);
      return dtos.map(mapGiftDTOToLegacy);
    } catch (error) {
      // Log error for debugging but return empty array to prevent UI breakage
      // This matches the original behavior in api-client.ts
      console.error('Erro ao buscar presentes:', error);
      return [];
    }
  },

  async reserve(data: ReserveGiftRequest): Promise<GiftActionResponse> {
    const request = {
      giftId: parseInt(data.giftId, 10),
      tipo: mapEventTypeToApi(data.tipo),
      name: data.name,
      phone: data.phone,
    };
    const response = await api.post<ApiResponse<ReservationData>>('/api/v1/gifts/reserve', request);
    return {
      success: response.success,
      message: response.message,
      accessCode: response.data?.reservationCode,
    };
  },

  async markAsPurchased(data: GiftActionRequest): Promise<GiftActionResponse> {
    const request = {
      giftId: parseInt(data.giftId, 10),
      tipo: mapEventTypeToApi(data.tipo),
      code: data.code,
    };
    const response = await api.post<ApiResponse>('/api/v1/gifts/mark-purchased', request);
    return {
      success: response.success,
      message: response.message,
    };
  },

  async cancelReservation(data: GiftActionRequest): Promise<GiftActionResponse> {
    const request = {
      giftId: parseInt(data.giftId, 10),
      tipo: mapEventTypeToApi(data.tipo),
      code: data.code,
    };
    const response = await api.post<ApiResponse>('/api/v1/gifts/cancel-reservation', request);
    return {
      success: response.success,
      message: response.message,
    };
  },
};
