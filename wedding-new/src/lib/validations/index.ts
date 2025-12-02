/**
 * Zod Validation Schemas for API Requests
 */
import { z } from 'zod';

// Re-export existing schemas with explicit names to avoid conflicts
export { rsvpSchema, type RSVPFormData } from './rsvp';
export { 
  reserveGiftSchema, 
  giftActionSchema, 
  type ReserveGiftFormData, 
  type GiftActionFormData 
} from './gift';

// Code validation schema (standalone for dialogs)
// Uses 6 characters as required by the Java API
export const codeValidationSchema = z.object({
  code: z
    .string()
    .length(6, 'Código deve ter 6 caracteres'),
});

export type CodeValidationFormData = z.infer<typeof codeValidationSchema>;
