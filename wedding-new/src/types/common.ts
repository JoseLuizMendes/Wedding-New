import { z } from 'zod';

/**
 * Common types and enums for the application
 */

// Event types as string literals (compatible with Zod)
export type EventType = 'casamento' | 'cha-panela';

// Gift status enum
export enum GiftStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  PURCHASED = 'purchased',
}

// Zod schemas for validation
export const EventTypeSchema = z.enum(['casamento', 'cha-panela']);
export const GiftStatusSchema = z.enum(['available', 'reserved', 'purchased']);

// Event type constants for convenience
export const EVENT_TYPE = {
  CASAMENTO: 'casamento' as EventType,
  CHA_PANELA: 'cha-panela' as EventType,
} as const;

// Helper function to check if a string is a valid EventType
export function isValidEventType(value: string): value is EventType {
  return value === EVENT_TYPE.CASAMENTO || value === EVENT_TYPE.CHA_PANELA;
}

// Helper function to normalize event type (case-insensitive)
export function normalizeEventType(tipo: string): EventType | null {
  const normalized = tipo?.toLowerCase();
  if (normalized === 'casamento') return EVENT_TYPE.CASAMENTO;
  if (normalized === 'cha-panela' || normalized === 'cha_panela') return EVENT_TYPE.CHA_PANELA;
  return null;
}
