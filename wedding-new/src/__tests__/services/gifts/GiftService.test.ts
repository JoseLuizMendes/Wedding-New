import { GiftService } from '@/services/gifts/GiftService';
import type { IGiftRepository } from '@/repositories/gifts/IGiftRepository';
import type { GiftEntity } from '@/types/gifts/gift.dto';

// Mock repository
const mockGiftRepository: jest.Mocked<IGiftRepository> = {
  findByEventType: jest.fn(),
  findById: jest.fn(),
  reserve: jest.fn(),
  cancelReservation: jest.fn(),
  markAsPurchased: jest.fn(),
  isCodeUnique: jest.fn(),
};

describe('GiftService', () => {
  let giftService: GiftService;

  beforeEach(() => {
    jest.clearAllMocks();
    giftService = new GiftService(mockGiftRepository);
  });

  describe('getGiftsByEventType', () => {
    it('should return gifts for casamento event', async () => {
      const mockGifts: GiftEntity[] = [
        {
          id: '1',
          nome: 'Test Gift',
          descricao: 'Description',
          link_externo: 'https://example.com',
          reservado: false,
          ordem: 1,
          reserved_until: null,
          is_bought: false,
          reserved_by: null,
          reserved_phone_hash: null,
          reserved_phone_display: null,
          reserved_at: null,
          purchased_at: null,
          telefone_contato: null,
          imagem: null,
        },
      ];

      mockGiftRepository.findByEventType.mockResolvedValue(mockGifts);

      const result = await giftService.getGiftsByEventType('casamento');

      expect(result).toEqual(mockGifts);
      expect(mockGiftRepository.findByEventType).toHaveBeenCalledWith('casamento');
    });
  });

  describe('reserveGift', () => {
    const mockGift: GiftEntity = {
      id: '1',
      nome: 'Test Gift',
      descricao: 'Description',
      link_externo: 'https://example.com',
      reservado: false,
      ordem: 1,
      reserved_until: null,
      is_bought: false,
      reserved_by: null,
      reserved_phone_hash: null,
      reserved_phone_display: null,
      reserved_at: null,
      purchased_at: null,
      telefone_contato: null,
      imagem: null,
    };

    it('should reserve a gift successfully', async () => {
      mockGiftRepository.findById.mockResolvedValue(mockGift);
      mockGiftRepository.isCodeUnique.mockResolvedValue(true);
      mockGiftRepository.reserve.mockResolvedValue({
        ...mockGift,
        reservado: true,
        reserved_by: 'John Doe',
      });

      const result = await giftService.reserveGift({
        giftId: '1',
        tipo: 'casamento',
        name: 'John Doe',
        phone: '11987654321',
      });

      expect(result).toHaveProperty('reservationCode');
      expect(result.reservationCode).toHaveLength(6);
      expect(mockGiftRepository.findById).toHaveBeenCalledWith('1', 'casamento');
      expect(mockGiftRepository.reserve).toHaveBeenCalled();
    });

    it('should throw error if gift not found', async () => {
      mockGiftRepository.findById.mockResolvedValue(null);

      await expect(
        giftService.reserveGift({
          giftId: '1',
          tipo: 'casamento',
          name: 'John Doe',
          phone: '11987654321',
        })
      ).rejects.toThrow('GIFT_NOT_FOUND');
    });

    it('should throw error if gift is already reserved', async () => {
      const reservedGift = { ...mockGift, reservado: true };
      mockGiftRepository.findById.mockResolvedValue(reservedGift);

      await expect(
        giftService.reserveGift({
          giftId: '1',
          tipo: 'casamento',
          name: 'John Doe',
          phone: '11987654321',
        })
      ).rejects.toThrow('GIFT_NOT_AVAILABLE');
    });

    it('should throw error if gift is already bought', async () => {
      const boughtGift = { ...mockGift, is_bought: true };
      mockGiftRepository.findById.mockResolvedValue(boughtGift);

      await expect(
        giftService.reserveGift({
          giftId: '1',
          tipo: 'casamento',
          name: 'John Doe',
          phone: '11987654321',
        })
      ).rejects.toThrow('GIFT_NOT_AVAILABLE');
    });
  });

  describe('cancelReservation', () => {
    const mockGift: GiftEntity = {
      id: '1',
      nome: 'Test Gift',
      descricao: 'Description',
      link_externo: 'https://example.com',
      reservado: true,
      ordem: 1,
      reserved_until: null,
      is_bought: false,
      reserved_by: 'John Doe',
      reserved_phone_hash: 'hash',
      reserved_phone_display: '(11) ****-4321',
      reserved_at: new Date(),
      purchased_at: null,
      telefone_contato: '123456',
      imagem: null,
    };

    it('should cancel reservation successfully', async () => {
      mockGiftRepository.findById.mockResolvedValue(mockGift);
      mockGiftRepository.cancelReservation.mockResolvedValue({
        ...mockGift,
        reservado: false,
      });

      await giftService.cancelReservation({
        giftId: '1',
        tipo: 'casamento',
        code: '123456',
      });

      expect(mockGiftRepository.findById).toHaveBeenCalledWith('1', 'casamento');
      expect(mockGiftRepository.cancelReservation).toHaveBeenCalledWith('1', 'casamento');
    });

    it('should throw error if gift not found', async () => {
      mockGiftRepository.findById.mockResolvedValue(null);

      await expect(
        giftService.cancelReservation({
          giftId: '1',
          tipo: 'casamento',
          code: '123456',
        })
      ).rejects.toThrow('GIFT_NOT_FOUND');
    });

    it('should throw error if code is invalid', async () => {
      mockGiftRepository.findById.mockResolvedValue(mockGift);

      await expect(
        giftService.cancelReservation({
          giftId: '1',
          tipo: 'casamento',
          code: 'wrongcode',
        })
      ).rejects.toThrow('INVALID_CODE');
    });

    it('should throw error if gift is not reserved', async () => {
      const notReservedGift = { ...mockGift, reservado: false };
      mockGiftRepository.findById.mockResolvedValue(notReservedGift);

      await expect(
        giftService.cancelReservation({
          giftId: '1',
          tipo: 'casamento',
          code: '123456',
        })
      ).rejects.toThrow('GIFT_NOT_RESERVED');
    });
  });

  describe('markAsPurchased', () => {
    const mockGift: GiftEntity = {
      id: '1',
      nome: 'Test Gift',
      descricao: 'Description',
      link_externo: 'https://example.com',
      reservado: true,
      ordem: 1,
      reserved_until: null,
      is_bought: false,
      reserved_by: 'John Doe',
      reserved_phone_hash: 'hash',
      reserved_phone_display: '(11) ****-4321',
      reserved_at: new Date(),
      purchased_at: null,
      telefone_contato: '123456',
      imagem: null,
    };

    it('should mark gift as purchased successfully', async () => {
      mockGiftRepository.findById.mockResolvedValue(mockGift);
      mockGiftRepository.markAsPurchased.mockResolvedValue({
        ...mockGift,
        is_bought: true,
        purchased_at: new Date(),
      });

      await giftService.markAsPurchased({
        giftId: '1',
        tipo: 'casamento',
        code: '123456',
      });

      expect(mockGiftRepository.findById).toHaveBeenCalledWith('1', 'casamento');
      expect(mockGiftRepository.markAsPurchased).toHaveBeenCalledWith('1', 'casamento');
    });

    it('should throw error if gift not found', async () => {
      mockGiftRepository.findById.mockResolvedValue(null);

      await expect(
        giftService.markAsPurchased({
          giftId: '1',
          tipo: 'casamento',
          code: '123456',
        })
      ).rejects.toThrow('GIFT_NOT_FOUND');
    });

    it('should throw error if code is invalid', async () => {
      mockGiftRepository.findById.mockResolvedValue(mockGift);

      await expect(
        giftService.markAsPurchased({
          giftId: '1',
          tipo: 'casamento',
          code: 'wrongcode',
        })
      ).rejects.toThrow('INVALID_CODE');
    });

    it('should throw error if gift is not reserved', async () => {
      const notReservedGift = { ...mockGift, reservado: false };
      mockGiftRepository.findById.mockResolvedValue(notReservedGift);

      await expect(
        giftService.markAsPurchased({
          giftId: '1',
          tipo: 'casamento',
          code: '123456',
        })
      ).rejects.toThrow('GIFT_NOT_RESERVED');
    });
  });
});
