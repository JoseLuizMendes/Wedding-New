/**
 * API Types for Java/Spring Boot Backend Integration
 * These types correspond to the DTOs defined in the Java API
 */

// Enums matching Java backend
export type EventType = 'CASAMENTO' | 'CHA_PANELA';
export type GiftStatus = 'AVAILABLE' | 'RESERVED' | 'PURCHASED';

// Frontend-friendly event type (used in URLs and UI)
export type FrontendEventType = 'casamento' | 'cha-panela';

// RSVP Types
export interface RSVPRequest {
  nomeCompleto: string;
  contato: string;
  mensagem?: string;
  eventType?: EventType;
}

export interface RSVPResponse {
  id: number;
  name: string;
  message?: string;
  confirmedAt: string;
}

// Gift Types
export interface GiftDTO {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  eventType: EventType;
  status: GiftStatus;
}

export interface ReserveGiftRequest {
  giftId: number;
  tipo: EventType;
  name: string;
  phone: string;
}

export interface GiftActionRequest {
  giftId: number;
  tipo: EventType;
  code: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ReservationData {
  reservationCode: string;
}

// Legacy Gift type for backward compatibility with existing components
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

// Helper function to map frontend event type to API event type
export function mapEventTypeToApi(frontendType: FrontendEventType): EventType {
  const mapping: Record<FrontendEventType, EventType> = {
    'casamento': 'CASAMENTO',
    'cha-panela': 'CHA_PANELA',
  };
  return mapping[frontendType];
}

// Helper function to map API event type to frontend event type
export function mapEventTypeToFrontend(apiType: EventType): FrontendEventType {
  const mapping: Record<EventType, FrontendEventType> = {
    'CASAMENTO': 'casamento',
    'CHA_PANELA': 'cha-panela',
  };
  return mapping[apiType];
}

// Helper function to map GiftDTO to legacy Gift format for backward compatibility
export function mapGiftDTOToLegacy(dto: GiftDTO): Gift {
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

// Helper function to map legacy Gift to GiftDTO format
export function mapLegacyToGiftDTO(gift: Gift, eventType: EventType): GiftDTO {
  let status: GiftStatus = 'AVAILABLE';
  if (gift.is_bought) {
    status = 'PURCHASED';
  } else if (gift.reservado) {
    status = 'RESERVED';
  }

  return {
    id: parseInt(gift.id, 10),
    name: gift.nome,
    description: gift.descricao,
    imageUrl: gift.imagem,
    price: null,
    eventType,
    status,
  };
}
