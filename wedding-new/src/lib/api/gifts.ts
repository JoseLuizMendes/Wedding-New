import { api } from './index';

export type EventType = 'casamento' | 'cha-panela';
export type GiftStatus = 'available' | 'reserved' | 'bought';

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

export const giftsApi = {
  async getByEvent(tipo: EventType): Promise<Gift[]> {
    try {
      return await api.get<Gift[]>(`/api/gifts/${tipo}`);
    } catch (error) {
      console.error('Erro ao buscar presentes:', error);
      return []; // Return empty array instead of throwing
    }
  },

  async reserve(data: ReserveGiftRequest): Promise<GiftActionResponse> {
    return api.post('/api/gifts/reserve', data);
  },

  async markAsPurchased(data: GiftActionRequest): Promise<GiftActionResponse> {
    return api.post('/api/gifts/mark-purchased', data);
  },

  async cancelReservation(data: GiftActionRequest): Promise<GiftActionResponse> {
    return api.post('/api/gifts/cancel-reservation', data);
  },
};
