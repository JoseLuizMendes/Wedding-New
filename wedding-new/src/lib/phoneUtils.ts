/**
 * Extract last 4 digits from a phone number
 */
export function extractLast4Digits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-4);
}

/**
 * Mask phone number for display
 * Example: (11) 98765-4321 -> (11) ****-4321
 */
export function maskPhoneNumber(phone: string): string {
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
 * Format phone number with mask for input
 */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 7) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else if (digits.length <= 10) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
  } else {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
  }
}

/**
 * Validate phone number (should have 10 or 11 digits)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}