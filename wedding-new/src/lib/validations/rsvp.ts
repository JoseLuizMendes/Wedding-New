import { z } from 'zod';

export const rsvpSchema = z.object({
  nome_completo: z
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

export type RSVPFormData = z.infer<typeof rsvpSchema>;
