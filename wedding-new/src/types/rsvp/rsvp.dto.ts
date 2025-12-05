import { z } from 'zod';
import { EventTypeSchema, EventType } from '../common';

/**
 * DTOs for RSVP domain with Zod validation
 */

// =====================
// Validation Schemas
// =====================

export const CreateRsvpDTOSchema = z.object({
  nomeCompleto: z.string()
    .min(1, 'Nome completo é obrigatório')
    .max(255, 'Nome muito longo'),
  contato: z.string()
    .min(1, 'Contato é obrigatório')
    .max(255, 'Contato muito longo'),
  mensagem: z.string()
    .max(1000, 'Mensagem muito longa')
    .optional(),
  tipo: EventTypeSchema,
});

// =====================
// DTO Types
// =====================

export type CreateRsvpDTO = z.infer<typeof CreateRsvpDTOSchema>;

// =====================
// Entity Types
// =====================

export interface RsvpEntity {
  id: string;
  nome_completo: string;
  contato: string;
  mensagem: string | null;
  created_at: Date;
  updated_at: Date;
}

// =====================
// Response Types
// =====================

export interface RsvpResponse {
  id: string;
  name: string;
  message: string | null;
  confirmedAt: string;
}

// =====================
// Helper Functions
// =====================

/**
 * Convert RsvpEntity to RsvpResponse
 * Maps entity fields to API response format
 */
export function mapRsvpEntityToResponse(rsvp: RsvpEntity): RsvpResponse {
  return {
    id: rsvp.id,
    name: rsvp.nome_completo,
    message: rsvp.mensagem,
    confirmedAt: rsvp.created_at.toISOString(),
  };
}
