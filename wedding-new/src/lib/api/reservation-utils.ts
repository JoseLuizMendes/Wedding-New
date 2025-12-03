import { createHash } from 'crypto';

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_LENGTH = 6;

/**
 * Generate a random 6-character reservation code
 */
export function generateReservationCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHANUMERIC.length);
    code += ALPHANUMERIC.charAt(randomIndex);
  }
  return code;
}

/**
 * Hash phone number using SHA-256
 * Used for secure storage and validation
 */
export function hashPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return createHash('sha256').update(digits).digest('hex');
}

/**
 * Calculate reservation expiry time (48 hours from now)
 */
export function getReservationExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 48);
  return expiry;
}

/**
 * Mask phone number for display
 * Example: (11) 98765-4321 -> (11) ****-4321
 */
export function maskPhoneForDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 11) {
    // Format: (XX) 9XXXX-XXXX -> (XX) ****-XXXX
    const ddd = digits.substring(0, 2);
    const lastFour = digits.substring(7, 11);
    return `(${ddd}) ****-${lastFour}`;
  } else if (digits.length === 10) {
    // Format: (XX) XXXX-XXXX -> (XX) ****-XXXX
    const ddd = digits.substring(0, 2);
    const lastFour = digits.substring(6, 10);
    return `(${ddd}) ****-${lastFour}`;
  }
  
  // Fallback: just show last 4 digits
  const lastFour = digits.slice(-4);
  return `****-${lastFour}`;
}

/**
 * Check if reservation is expired
 */
export function isReservationExpired(reservedUntil: Date | null): boolean {
  if (!reservedUntil) return false;
  return new Date() > reservedUntil;
}
