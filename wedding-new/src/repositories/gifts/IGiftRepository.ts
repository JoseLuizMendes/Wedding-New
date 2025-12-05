import type { EventType } from '@/types/common';
import type { GiftEntity } from '@/types/gifts/gift.dto';

/**
 * Gift Repository Interface
 * Defines data access operations for gifts
 * Follows Dependency Inversion Principle (SOLID)
 */
export interface IGiftRepository {
  /**
   * Find all gifts by event type
   * @param tipo - Event type (casamento or cha-panela)
   * @returns Array of gifts ordered by ordem
   */
  findByEventType(tipo: EventType): Promise<GiftEntity[]>;

  /**
   * Find a single gift by ID and event type
   * @param id - Gift ID
   * @param tipo - Event type
   * @returns Gift entity or null if not found
   */
  findById(id: string, tipo: EventType): Promise<GiftEntity | null>;

  /**
   * Reserve a gift
   * @param id - Gift ID
   * @param tipo - Event type
   * @param data - Reservation data
   * @returns Updated gift entity
   */
  reserve(
    id: string,
    tipo: EventType,
    data: {
      reserved_by: string;
      reserved_phone_hash: string;
      reserved_phone_display: string;
      reserved_at: Date;
      reserved_until: Date;
      telefone_contato: string; // Reservation code
    }
  ): Promise<GiftEntity>;

  /**
   * Cancel a gift reservation
   * @param id - Gift ID
   * @param tipo - Event type
   * @returns Updated gift entity
   */
  cancelReservation(id: string, tipo: EventType): Promise<GiftEntity>;

  /**
   * Mark a gift as purchased
   * @param id - Gift ID
   * @param tipo - Event type
   * @returns Updated gift entity
   */
  markAsPurchased(id: string, tipo: EventType): Promise<GiftEntity>;

  /**
   * Check if a reservation code is unique across all gifts
   * @param code - Reservation code to check
   * @returns True if code is unique (not in use), false otherwise
   */
  isCodeUnique(code: string): Promise<boolean>;
}
