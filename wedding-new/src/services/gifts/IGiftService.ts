import { EventType } from '@/types/common';
import {
  GiftEntity,
  ReserveGiftDTO,
  CancelReservationDTO,
  MarkPurchasedDTO,
} from '@/types/gifts/gift.dto';

/**
 * Gift Service Interface
 * Defines business logic operations for gifts
 * Follows Dependency Inversion Principle (SOLID)
 */
export interface IGiftService {
  /**
   * Get all gifts for a specific event type
   * @param tipo - Event type
   * @returns Array of gift entities
   */
  getGiftsByEventType(tipo: EventType): Promise<GiftEntity[]>;

  /**
   * Reserve a gift
   * @param dto - Reserve gift data
   * @returns Object with reservation code
   * @throws Error if gift is not available or not found
   */
  reserveGift(dto: ReserveGiftDTO): Promise<{ reservationCode: string }>;

  /**
   * Cancel a gift reservation
   * @param dto - Cancel reservation data
   * @throws Error if code is invalid or gift is not reserved
   */
  cancelReservation(dto: CancelReservationDTO): Promise<void>;

  /**
   * Mark a gift as purchased
   * @param dto - Mark purchased data
   * @throws Error if code is invalid or gift is not reserved
   */
  markAsPurchased(dto: MarkPurchasedDTO): Promise<void>;
}
