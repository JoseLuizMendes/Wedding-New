import { z } from 'zod';
import { EventTypeSchema, GiftStatusSchema, EventType, GiftStatus } from '../common';

/**
 * DTOs for Gift domain with Zod validation
 */

// =====================
// Validation Schemas
// =====================

export const ReserveGiftDTOSchema = z.object({
  giftId: z.string().uuid(),
  tipo: EventTypeSchema,
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  phone: z.string().min(10, 'Telefone inválido').max(20),
});

export const CancelReservationDTOSchema = z.object({
  giftId: z.string().uuid(),
  tipo: EventTypeSchema,
  code: z.string().length(6, 'Código deve ter 6 dígitos').regex(/^\d+$/, 'Código deve conter apenas números'),
});

export const MarkPurchasedDTOSchema = z.object({
  giftId: z.string().uuid(),
  tipo: EventTypeSchema,
  code: z.string().length(6, 'Código deve ter 6 dígitos').regex(/^\d+$/, 'Código deve conter apenas números'),
});

export const GetGiftsByEventDTOSchema = z.object({
  tipo: EventTypeSchema,
});

// =====================
// DTO Types
// =====================

export type ReserveGiftDTO = z.infer<typeof ReserveGiftDTOSchema>;
export type CancelReservationDTO = z.infer<typeof CancelReservationDTOSchema>;
export type MarkPurchasedDTO = z.infer<typeof MarkPurchasedDTOSchema>;
export type GetGiftsByEventDTO = z.infer<typeof GetGiftsByEventDTOSchema>;

// =====================
// Entity Types
// =====================

export interface GiftEntity {
  id: string;
  nome: string;
  descricao: string | null;
  link_externo: string;
  reservado: boolean;
  ordem: number;
  created_at?: Date;
  reserved_until: Date | null;
  is_bought: boolean;
  reserved_by: string | null;
  reserved_phone_hash: string | null;
  reserved_phone_display: string | null;
  reserved_at: Date | null;
  purchased_at: Date | null;
  telefone_contato: string | null; // Stores reservation code
  imagem: string | null;
}

// =====================
// Response Types
// =====================

export interface GiftListResponse {
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

export interface ReserveGiftResponse {
  success: boolean;
  message: string;
  data?: {
    reservationCode: string;
  };
}

export interface GiftActionResponse {
  success: boolean;
  message: string;
}

// =====================
// Helper Functions
// =====================

/**
 * Convert GiftEntity to GiftListResponse
 * Maps dates to ISO strings and excludes sensitive fields
 */
export function mapGiftEntityToResponse(gift: GiftEntity): GiftListResponse {
  return {
    id: gift.id,
    nome: gift.nome,
    descricao: gift.descricao,
    link_externo: gift.link_externo,
    reservado: gift.reservado,
    ordem: gift.ordem,
    reserved_until: gift.reserved_until?.toISOString() || null,
    is_bought: gift.is_bought,
    reserved_by: gift.reserved_by,
    reserved_phone_display: gift.reserved_phone_display,
    reserved_at: gift.reserved_at?.toISOString() || null,
    purchased_at: gift.purchased_at?.toISOString() || null,
    imagem: gift.imagem,
  };
}
