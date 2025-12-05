import type { EventType } from '@/types/common';
import type {
  GiftEntity,
  ReserveGiftDTO,
  CancelReservationDTO,
  MarkPurchasedDTO,
} from '@/types/gifts/gift.dto';
import type { IGiftRepository } from '@/repositories/gifts/IGiftRepository';
import type { IGiftService } from './IGiftService';
import {
  generateRandomCode,
  hashPhoneNumber,
  maskPhoneForDisplay,
  getReservationExpiry,
} from '@/utils/reservation/reservation-code.utils';

/**
 * Gift Service Implementation
 * Contains business logic for gift management
 * Receives repository via Dependency Injection
 */
export class GiftService implements IGiftService {
  constructor(private readonly giftRepository: IGiftRepository) {}

  async getGiftsByEventType(tipo: EventType): Promise<GiftEntity[]> {
    return await this.giftRepository.findByEventType(tipo);
  }

  async reserveGift(dto: ReserveGiftDTO): Promise<{ reservationCode: string }> {
    // Validate gift exists and is available
    const gift = await this.giftRepository.findById(dto.giftId, dto.tipo);
    
    if (!gift) {
      throw new Error('GIFT_NOT_FOUND');
    }
    
    if (gift.reservado || gift.is_bought) {
      throw new Error('GIFT_NOT_AVAILABLE');
    }

    // Generate unique reservation code
    const reservationCode = await this.generateUniqueCode();

    // Normalize phone and create hash
    const normalizedPhone = dto.phone.replace(/\D/g, '');
    const phoneHash = hashPhoneNumber(normalizedPhone);
    const phoneDisplay = maskPhoneForDisplay(dto.phone);
    const reservedUntil = getReservationExpiry();

    // Reserve the gift
    await this.giftRepository.reserve(dto.giftId, dto.tipo, {
      reserved_by: dto.name,
      reserved_phone_hash: phoneHash,
      reserved_phone_display: phoneDisplay,
      reserved_at: new Date(),
      reserved_until: reservedUntil,
      telefone_contato: reservationCode,
    });

    return { reservationCode };
  }

  async cancelReservation(dto: CancelReservationDTO): Promise<void> {
    // Find the gift
    const gift = await this.giftRepository.findById(dto.giftId, dto.tipo);
    
    if (!gift) {
      throw new Error('GIFT_NOT_FOUND');
    }

    // Validate reservation code
    if (!gift.telefone_contato || gift.telefone_contato !== dto.code) {
      throw new Error('INVALID_CODE');
    }

    // Check if gift is reserved
    if (!gift.reservado) {
      throw new Error('GIFT_NOT_RESERVED');
    }

    // Cancel the reservation
    await this.giftRepository.cancelReservation(dto.giftId, dto.tipo);
  }

  async markAsPurchased(dto: MarkPurchasedDTO): Promise<void> {
    // Find the gift
    const gift = await this.giftRepository.findById(dto.giftId, dto.tipo);
    
    if (!gift) {
      throw new Error('GIFT_NOT_FOUND');
    }

    // Validate reservation code
    if (!gift.telefone_contato || gift.telefone_contato !== dto.code) {
      throw new Error('INVALID_CODE');
    }

    // Check if gift is reserved
    if (!gift.reservado) {
      throw new Error('GIFT_NOT_RESERVED');
    }

    // Mark as purchased
    await this.giftRepository.markAsPurchased(dto.giftId, dto.tipo);
  }

  /**
   * Generate a unique reservation code
   * Keeps generating until a unique code is found
   */
  private async generateUniqueCode(): Promise<string> {
    let code = '';
    let isUnique = false;

    while (!isUnique) {
      code = generateRandomCode();
      isUnique = await this.giftRepository.isCodeUnique(code);
    }

    return code;
  }
}
