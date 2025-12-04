import { randomInt } from 'crypto';
import { createHash } from 'crypto';
import prisma from '@/lib/prisma';

const CODE_LENGTH = 6;

/**
 * Generate a unique 6-digit numeric reservation code
 * Ensures the code is not already in use by checking both gift tables
 */
export async function generateReservationCode(): Promise<string> {
  let code = '';
  let isUnique = false;
  
  while (!isUnique) {
    // Generate 6-digit numeric code
    code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += randomInt(0, 10).toString();
    }
    
    // Check if code is already in use in both tables
    const [existingCasamento, existingChaPanela] = await Promise.all([
      prisma.presentesCasamento.findFirst({
        where: { telefone_contato: code }
      }),
      prisma.presentesChaPanela.findFirst({
        where: { telefone_contato: code }
      })
    ]);
    
    // Code is unique if not found in either table
    isUnique = !existingCasamento && !existingChaPanela;
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
