import { z } from 'zod';

export const reserveGiftSchema = z.object({
  giftId: z.string().min(1, 'ID do presente é obrigatório'),
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  phone: z
    .string()
    .min(10, 'Telefone inválido'),
});

export const giftActionSchema = z.object({
  giftId: z.string().min(1, 'ID do presente é obrigatório'),
  code: z
    .string()
    .length(6, 'Código deve ter 6 caracteres'),
});

export type ReserveGiftFormData = z.infer<typeof reserveGiftSchema>;
export type GiftActionFormData = z.infer<typeof giftActionSchema>;
