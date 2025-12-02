/**
 * Zod Validation Schemas for API Requests
 */
import { z } from 'zod';

// Re-export existing schemas
export * from './rsvp';
export * from './gift';

// RSVP Schema (camelCase for Java API)
export const rsvpRequestSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  contato: z
    .string()
    .trim()
    .min(10, 'Telefone inválido')
    .max(20, 'Telefone inválido'),
  mensagem: z
    .string()
    .max(500, 'Mensagem deve ter no máximo 500 caracteres')
    .optional(),
});

export type RSVPRequestFormData = z.infer<typeof rsvpRequestSchema>;

// Reserve Gift Schema
export const reserveGiftRequestSchema = z.object({
  giftId: z.number().positive('ID do presente é obrigatório'),
  name: z
    .string()
    .trim()
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  phone: z
    .string()
    .trim()
    .min(10, 'Telefone inválido'),
});

export type ReserveGiftRequestFormData = z.infer<typeof reserveGiftRequestSchema>;

// Gift Action Schema (for mark purchased and cancel reservation)
// Code is now 6 characters as per Java API
export const giftActionRequestSchema = z.object({
  giftId: z.number().positive('ID do presente é obrigatório'),
  code: z
    .string()
    .length(6, 'Código deve ter 6 caracteres'),
});

export type GiftActionRequestFormData = z.infer<typeof giftActionRequestSchema>;

// Code validation schema (standalone for dialogs)
export const codeValidationSchema = z.object({
  code: z
    .string()
    .length(6, 'Código deve ter 6 caracteres'),
});

export type CodeValidationFormData = z.infer<typeof codeValidationSchema>;
