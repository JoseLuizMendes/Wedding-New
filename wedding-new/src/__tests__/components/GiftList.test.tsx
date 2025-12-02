import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GiftList } from '@/_components/gifts/GiftList';

// Mock functions need to be declared before jest.mock
const mockGetByEvent = jest.fn();

// Mock framer-motion to prevent animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
}));

// Mock useGiftReservation hook
jest.mock('../../hooks/useGiftReservation', () => ({
  useGiftReservation: () => ({
    reserveGift: jest.fn(),
    markAsBought: jest.fn(),
    cancelReservation: jest.fn(),
    timeRemaining: '2h 30m',
    isExpired: false,
  }),
}));

// Mock OptimizedImage component - use a simple placeholder
jest.mock('@/_components/ui/OptimizedImage', () => ({
  OptimizedImage: () => <div data-testid="optimized-image" />,
}));

// Mock gifts API
jest.mock('@/lib/api/gifts', () => ({
  giftsApi: {
    getByEvent: (...args: unknown[]) => mockGetByEvent(...args),
  },
}));

const mockGifts = [
  {
    id: '1',
    nome: 'Jogo de Panelas',
    descricao: 'Jogo de panelas antiaderentes',
    imagem: '/images/gift1.jpg',
    link_externo: 'https://example.com/gift1',
    reservado: false,
    reserved_until: null,
    is_bought: false,
    ordem: 1,
    reserved_by: null,
    reserved_phone_display: null,
    reserved_at: null,
    purchased_at: null,
  },
  {
    id: '2',
    nome: 'Liquidificador',
    descricao: 'Liquidificador 1000W',
    imagem: '/images/gift2.jpg',
    link_externo: 'https://example.com/gift2',
    reservado: true,
    reserved_until: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    is_bought: false,
    ordem: 2,
    reserved_by: 'Maria',
    reserved_phone_display: '(11) ****-8888',
    reserved_at: new Date().toISOString(),
    purchased_at: null,
  },
  {
    id: '3',
    nome: 'Cafeteira',
    descricao: 'Cafeteira elétrica',
    imagem: '/images/gift3.jpg',
    link_externo: 'https://example.com/gift3',
    reservado: true,
    reserved_until: null,
    is_bought: true,
    ordem: 3,
    reserved_by: 'João',
    reserved_phone_display: '(21) ****-7777',
    reserved_at: new Date().toISOString(),
    purchased_at: new Date().toISOString(),
  },
];

describe('GiftList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetByEvent.mockResolvedValue(mockGifts);
  });

  it('should render loading skeleton initially', () => {
    // Make the API hang to see loading state
    mockGetByEvent.mockImplementation(() => new Promise(() => {}));
    
    render(<GiftList tipo="casamento" />);
    
    // Should show loading skeletons - check for skeleton component's presence
    expect(document.querySelector('[class*="skeleton"], [class*="animate-pulse"]')).toBeInTheDocument();
  });

  it('should render gifts after loading', async () => {
    render(<GiftList tipo="casamento" />);
    
    // Wait for gifts to load
    await waitFor(() => {
      expect(screen.getByText('Jogo de Panelas')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Liquidificador')).toBeInTheDocument();
    expect(screen.getByText('Cafeteira')).toBeInTheDocument();
  });

  it('should show stats correctly', async () => {
    render(<GiftList tipo="casamento" />);
    
    await waitFor(() => {
      expect(screen.getByText('Jogo de Panelas')).toBeInTheDocument();
    });
    
    // Find the stat labels - these are in card content with class text-muted-foreground
    // Use getAllByText since tabs also contain similar text
    expect(screen.getAllByText('Total').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/disponíveis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/reservados/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/comprados/i).length).toBeGreaterThan(0);
  });

  it('should filter gifts by status', async () => {
    const user = userEvent.setup();
    render(<GiftList tipo="casamento" />);
    
    await waitFor(() => {
      expect(screen.getByText('Jogo de Panelas')).toBeInTheDocument();
    });
    
    // Click on "Disponíveis" tab
    await user.click(screen.getByRole('tab', { name: /disponíveis/i }));
    
    await waitFor(() => {
      // Should only show available gift
      expect(screen.getByText('Jogo de Panelas')).toBeInTheDocument();
      // Reserved and bought gifts should not be visible
      expect(screen.queryByText('Cafeteira')).not.toBeInTheDocument();
    });
  });

  it('should show available gift with "Quero Presentear" button', async () => {
    render(<GiftList tipo="casamento" />);
    
    await waitFor(() => {
      expect(screen.getByText('Jogo de Panelas')).toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: /quero presentear/i })).toBeInTheDocument();
  });

  it('should show reserved gift with appropriate badge', async () => {
    render(<GiftList tipo="casamento" />);
    
    await waitFor(() => {
      expect(screen.getByText('Liquidificador')).toBeInTheDocument();
    });
    
    // Reserved gift should have "Reservado" text somewhere
    const reservedBadges = screen.getAllByText(/reservado/i);
    expect(reservedBadges.length).toBeGreaterThan(0);
  });

  it('should show bought gift with disabled state', async () => {
    render(<GiftList tipo="casamento" />);
    
    await waitFor(() => {
      expect(screen.getByText('Cafeteira')).toBeInTheDocument();
    });
    
    // Bought gift should have "Comprado" badge
    const boughtBadges = screen.getAllByText(/comprado/i);
    expect(boughtBadges.length).toBeGreaterThan(0);
  });

  it('should handle API error gracefully', async () => {
    // Mock API to return empty array on error (that's how giftsApi handles errors)
    mockGetByEvent.mockResolvedValue([]);

    render(<GiftList tipo="casamento" />);
    
    // Should not crash, just show no gifts
    await waitFor(() => {
      // Stats should show zeros after error
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThan(0);
    });
  });

  it('should show empty state when no gifts available', async () => {
    // Mock API to return empty array
    mockGetByEvent.mockResolvedValue([]);

    render(<GiftList tipo="casamento" />);
    
    await waitFor(() => {
      // Stats should show zeros
      const statsTexts = screen.getAllByText('0');
      expect(statsTexts.length).toBeGreaterThan(0);
    });
  });

  it('should render correctly for cha-panela event', async () => {
    const chaPanelaGifts = [
      {
        id: '10',
        nome: 'Conjunto de Potes',
        descricao: 'Kit de potes para cozinha',
        imagem: null,
        link_externo: 'https://example.com/gift10',
        reservado: false,
        reserved_until: null,
        is_bought: false,
        ordem: 1,
        reserved_by: null,
        reserved_phone_display: null,
        reserved_at: null,
        purchased_at: null,
      },
    ];
    
    mockGetByEvent.mockResolvedValue(chaPanelaGifts);

    render(<GiftList tipo="cha-panela" />);
    
    await waitFor(() => {
      expect(screen.getByText('Conjunto de Potes')).toBeInTheDocument();
    });
    
    expect(mockGetByEvent).toHaveBeenCalledWith('cha-panela');
  });

  it('should have correct tabs', async () => {
    render(<GiftList tipo="casamento" />);
    
    await waitFor(() => {
      expect(screen.getByText('Jogo de Panelas')).toBeInTheDocument();
    });
    
    expect(screen.getByRole('tab', { name: /todos/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /disponíveis/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /reservados/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /comprados/i })).toBeInTheDocument();
  });

  it('should call getByEvent with correct event type', async () => {
    render(<GiftList tipo="casamento" />);
    
    await waitFor(() => {
      expect(mockGetByEvent).toHaveBeenCalledWith('casamento');
    });
  });
});
