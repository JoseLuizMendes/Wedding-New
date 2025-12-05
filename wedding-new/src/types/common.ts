import { z } from 'zod';

/**
 * Common types and enums for the application
 */

// Event types enum
export enum EventType {
  CASAMENTO = 'casamento',
  CHA_PANELA = 'cha-panela',
}

// Gift status enum
export enum GiftStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  PURCHASED = 'purchased',
}

// Zod schemas for validation
export const EventTypeSchema = z.enum(['casamento', 'cha-panela']);
export const GiftStatusSchema = z.enum(['available', 'reserved', 'purchased']);

// Helper function to check if a string is a valid EventType
export function isValidEventType(value: string): value is EventType {
  return value === EventType.CASAMENTO || value === EventType.CHA_PANELA;
}

// Helper function to normalize event type (case-insensitive)
export function normalizeEventType(tipo: string): EventType | null {
  const normalized = tipo?.toLowerCase();
  if (normalized === 'casamento') return EventType.CASAMENTO;
  if (normalized === 'cha-panela' || normalized === 'cha_panela') return EventType.CHA_PANELA;
  return null;
}
