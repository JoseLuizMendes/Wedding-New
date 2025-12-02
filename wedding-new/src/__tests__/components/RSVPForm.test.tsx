import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RSVPForm } from '@/_components/forms/RSVPForm';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: jest.fn(),
  Toaster: () => null,
}));

// Mock inviteConfig
jest.mock('../../config/inviteConfig', () => ({
  shouldShowInviteAfterRSVP: jest.fn().mockReturnValue(false),
  getSuccessMessage: jest.fn().mockReturnValue('Sucesso!'),
}));

// Mock inviteUtils
jest.mock('../../utils/inviteUtils', () => ({
  openAndDownloadInvite: jest.fn(),
}));

// Mock the rsvp API
jest.mock('@/lib/api/rsvp', () => ({
  rsvpApi: {
    confirmWedding: jest.fn(),
    confirmBridalShower: jest.fn(),
  },
}));

describe('RSVPForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderRSVPForm = (tipo: 'casamento' | 'cha-panela' = 'casamento') => {
    return render(<RSVPForm tipo={tipo} />);
  };

  it('should render the form with all required fields', () => {
    renderRSVPForm();
    
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar presença/i })).toBeInTheDocument();
  });

  it('should show validation error for short name', async () => {
    const user = userEvent.setup();
    const { toast } = jest.requireMock('sonner');
    
    renderRSVPForm();
    
    await user.type(screen.getByLabelText(/nome completo/i), 'AB');
    await user.type(screen.getByLabelText(/telefone/i), '11999998888');
    await user.click(screen.getByRole('button', { name: /confirmar presença/i }));
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        'Erro ao confirmar presença',
        expect.objectContaining({
          description: expect.stringContaining('3 caracteres'),
        })
      );
    });
  });

  it('should show validation error for short phone', async () => {
    const user = userEvent.setup();
    const { toast } = jest.requireMock('sonner');
    
    renderRSVPForm();
    
    await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
    await user.type(screen.getByLabelText(/telefone/i), '1199');
    await user.click(screen.getByRole('button', { name: /confirmar presença/i }));
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        'Erro ao confirmar presença',
        expect.objectContaining({
          description: expect.stringContaining('Telefone inválido'),
        })
      );
    });
  });

  it('should submit form successfully for casamento event', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    const { toast } = jest.requireMock('sonner');
    const { rsvpApi } = jest.requireMock('@/lib/api/rsvp');
    
    rsvpApi.confirmWedding.mockResolvedValue({
      id: '1',
      nome_completo: 'João Silva',
      contato: '11999998888',
      created_at: new Date().toISOString(),
    });
    
    render(<RSVPForm tipo="casamento" onSuccess={onSuccess} />);
    
    await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
    await user.type(screen.getByLabelText(/telefone/i), '11999998888');
    await user.type(screen.getByLabelText(/mensagem/i), 'Parabéns pelo casamento!');
    await user.click(screen.getByRole('button', { name: /confirmar presença/i }));
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        '✅ Presença confirmada!',
        expect.objectContaining({
          description: expect.any(String),
        })
      );
    });
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should submit form successfully for cha-panela event', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    const { toast } = jest.requireMock('sonner');
    const { rsvpApi } = jest.requireMock('@/lib/api/rsvp');
    
    rsvpApi.confirmBridalShower.mockResolvedValue({
      id: '2',
      nome_completo: 'Maria Santos',
      contato: '21988887777',
      created_at: new Date().toISOString(),
    });
    
    render(<RSVPForm tipo="cha-panela" onSuccess={onSuccess} />);
    
    await user.type(screen.getByLabelText(/nome completo/i), 'Maria Santos');
    await user.type(screen.getByLabelText(/telefone/i), '21988887777');
    await user.click(screen.getByRole('button', { name: /confirmar presença/i }));
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        '✅ Presença confirmada!',
        expect.objectContaining({
          description: expect.any(String),
        })
      );
    });
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should disable button while submitting', async () => {
    const user = userEvent.setup();
    const { rsvpApi } = jest.requireMock('@/lib/api/rsvp');
    
    // Make the API call hang indefinitely
    rsvpApi.confirmWedding.mockImplementation(() => new Promise(() => {}));
    
    renderRSVPForm();
    
    await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
    await user.type(screen.getByLabelText(/telefone/i), '11999998888');
    
    const button = screen.getByRole('button', { name: /confirmar presença/i });
    await user.click(button);
    
    // Button should show loading state
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(/confirmando/i);
    });
  });

  it('should clear form after successful submission', async () => {
    const user = userEvent.setup();
    const { rsvpApi } = jest.requireMock('@/lib/api/rsvp');
    
    rsvpApi.confirmWedding.mockResolvedValue({
      id: '1',
      nome_completo: 'João Silva',
      contato: '11999998888',
      created_at: new Date().toISOString(),
    });
    
    renderRSVPForm();
    
    const nomeInput = screen.getByLabelText(/nome completo/i);
    const contatoInput = screen.getByLabelText(/telefone/i);
    const mensagemInput = screen.getByLabelText(/mensagem/i);
    
    await user.type(nomeInput, 'João Silva');
    await user.type(contatoInput, '11999998888');
    await user.type(mensagemInput, 'Parabéns!');
    await user.click(screen.getByRole('button', { name: /confirmar presença/i }));
    
    await waitFor(() => {
      expect(nomeInput).toHaveValue('');
      expect(contatoInput).toHaveValue('');
      expect(mensagemInput).toHaveValue('');
    });
  });

  it('should show error when API call fails', async () => {
    const user = userEvent.setup();
    const { toast } = jest.requireMock('sonner');
    const { rsvpApi } = jest.requireMock('@/lib/api/rsvp');
    
    rsvpApi.confirmWedding.mockRejectedValue(new Error('Server error'));
    
    renderRSVPForm();
    
    await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
    await user.type(screen.getByLabelText(/telefone/i), '11999998888');
    await user.click(screen.getByRole('button', { name: /confirmar presença/i }));
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        'Erro ao confirmar presença',
        expect.objectContaining({
          description: expect.any(String),
        })
      );
    });
  });
});
