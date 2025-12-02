import { renderHook, act, waitFor } from '@testing-library/react';
import { useGiftReservation } from '@/hooks/useGiftReservation';
import { giftsApi } from '@/lib/api/gifts';

// Mock the giftsApi module
jest.mock('@/lib/api/gifts', () => ({
  giftsApi: {
    reserve: jest.fn(),
    markAsPurchased: jest.fn(),
    cancelReservation: jest.fn(),
  },
}));

// Mock the useToast hook
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('useGiftReservation', () => {
  const mockOnReservationChange = jest.fn();
  
  const defaultProps = {
    giftId: '1',
    tipo: 'casamento' as const,
    reservedUntil: null,
    isBought: false,
    onReservationChange: mockOnReservationChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('reserveGift', () => {
    it('should reserve a gift successfully', async () => {
      const mockGiftsApi = giftsApi as jest.Mocked<typeof giftsApi>;
      mockGiftsApi.reserve.mockResolvedValue({
        success: true,
        message: 'Presente reservado!',
        accessCode: 'ABC123',
      });

      const { result } = renderHook(() => useGiftReservation(defaultProps));

      await act(async () => {
        await result.current.reserveGift('João Silva', '11999998888');
      });

      expect(mockGiftsApi.reserve).toHaveBeenCalledWith({
        giftId: '1',
        tipo: 'casamento',
        name: 'João Silva',
        phone: '11999998888',
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Presente reservado!',
        description: expect.stringContaining('ABC123'),
      });

      expect(mockOnReservationChange).toHaveBeenCalled();
    });

    it('should save name in localStorage after successful reservation', async () => {
      const mockGiftsApi = giftsApi as jest.Mocked<typeof giftsApi>;
      mockGiftsApi.reserve.mockResolvedValue({
        success: true,
        message: 'Presente reservado!',
        accessCode: 'ABC123',
      });

      const localStorageSpy = jest.spyOn(Storage.prototype, 'setItem');

      const { result } = renderHook(() => useGiftReservation(defaultProps));

      await act(async () => {
        await result.current.reserveGift('João Silva', '11999998888');
      });

      expect(localStorageSpy).toHaveBeenCalledWith('gift_reservation_name', 'João Silva');
      localStorageSpy.mockRestore();
    });

    it('should show error toast when reservation fails', async () => {
      const mockGiftsApi = giftsApi as jest.Mocked<typeof giftsApi>;
      mockGiftsApi.reserve.mockRejectedValue(new Error('Este presente não está mais disponível.'));

      const { result } = renderHook(() => useGiftReservation(defaultProps));

      await act(async () => {
        await expect(
          result.current.reserveGift('João Silva', '11999998888')
        ).rejects.toThrow();
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Erro ao reservar',
        description: 'Este presente não está mais disponível.',
        variant: 'destructive',
      });
    });
  });

  describe('markAsBought', () => {
    it('should mark gift as bought successfully', async () => {
      const mockGiftsApi = giftsApi as jest.Mocked<typeof giftsApi>;
      mockGiftsApi.markAsPurchased.mockResolvedValue({
        success: true,
        message: 'Presente comprado!',
      });

      const { result } = renderHook(() => useGiftReservation(defaultProps));

      let success: boolean;
      await act(async () => {
        success = await result.current.markAsBought('ABC123');
      });

      expect(success!).toBe(true);
      expect(mockGiftsApi.markAsPurchased).toHaveBeenCalledWith({
        giftId: '1',
        tipo: 'casamento',
        code: 'ABC123',
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Presente comprado!',
        description: 'Obrigado por presentear os noivos!',
      });

      expect(mockOnReservationChange).toHaveBeenCalled();
    });

    it('should return false and show error when marking as bought fails', async () => {
      const mockGiftsApi = giftsApi as jest.Mocked<typeof giftsApi>;
      mockGiftsApi.markAsPurchased.mockRejectedValue(new Error('Código inválido'));

      const { result } = renderHook(() => useGiftReservation(defaultProps));

      let success: boolean;
      await act(async () => {
        success = await result.current.markAsBought('WRONG');
      });

      expect(success!).toBe(false);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Erro ao confirmar compra',
        description: 'Código inválido',
        variant: 'destructive',
      });
    });
  });

  describe('cancelReservation', () => {
    it('should cancel reservation successfully', async () => {
      const mockGiftsApi = giftsApi as jest.Mocked<typeof giftsApi>;
      mockGiftsApi.cancelReservation.mockResolvedValue({
        success: true,
        message: 'Reserva cancelada!',
      });

      const { result } = renderHook(() => useGiftReservation(defaultProps));

      let success: boolean;
      await act(async () => {
        success = await result.current.cancelReservation('ABC123');
      });

      expect(success!).toBe(true);
      expect(mockGiftsApi.cancelReservation).toHaveBeenCalledWith({
        giftId: '1',
        tipo: 'casamento',
        code: 'ABC123',
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Reserva cancelada!',
        description: 'O presente está disponível novamente.',
      });

      expect(mockOnReservationChange).toHaveBeenCalled();
    });

    it('should return false and show error when cancellation fails', async () => {
      const mockGiftsApi = giftsApi as jest.Mocked<typeof giftsApi>;
      mockGiftsApi.cancelReservation.mockRejectedValue(new Error('Código inválido'));

      const { result } = renderHook(() => useGiftReservation(defaultProps));

      let success: boolean;
      await act(async () => {
        success = await result.current.cancelReservation('WRONG');
      });

      expect(success!).toBe(false);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Erro ao cancelar reserva',
        description: 'Código inválido',
        variant: 'destructive',
      });
    });
  });

  describe('time remaining calculation', () => {
    it('should calculate time remaining correctly', async () => {
      const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000); // 2h 30m from now
      
      const { result } = renderHook(() =>
        useGiftReservation({
          ...defaultProps,
          reservedUntil: futureDate.toISOString(),
        })
      );

      // Wait for the effect to run
      await waitFor(() => {
        expect(result.current.timeRemaining).toBe('2h 30m');
      });
    });

    it('should return empty string when no reservation', () => {
      const { result } = renderHook(() => useGiftReservation(defaultProps));

      expect(result.current.timeRemaining).toBe('');
    });

    it('should return empty string when gift is bought', async () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      
      const { result } = renderHook(() =>
        useGiftReservation({
          ...defaultProps,
          reservedUntil: futureDate.toISOString(),
          isBought: true,
        })
      );

      expect(result.current.timeRemaining).toBe('');
    });
  });

  describe('isExpired', () => {
    it('should return true when reservation is expired', () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      
      const { result } = renderHook(() =>
        useGiftReservation({
          ...defaultProps,
          reservedUntil: pastDate.toISOString(),
        })
      );

      expect(result.current.isExpired).toBe(true);
    });

    it('should return false when reservation is not expired', () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      
      const { result } = renderHook(() =>
        useGiftReservation({
          ...defaultProps,
          reservedUntil: futureDate.toISOString(),
        })
      );

      expect(result.current.isExpired).toBe(false);
    });

    it('should return false when no reservation', () => {
      const { result } = renderHook(() => useGiftReservation(defaultProps));

      expect(result.current.isExpired).toBe(false);
    });

    it('should return false when gift is bought even if date is past', () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000);
      
      const { result } = renderHook(() =>
        useGiftReservation({
          ...defaultProps,
          reservedUntil: pastDate.toISOString(),
          isBought: true,
        })
      );

      expect(result.current.isExpired).toBe(false);
    });
  });
});
