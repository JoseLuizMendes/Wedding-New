import { RsvpService } from '@/services/rsvp/RsvpService';
import type { IRsvpRepository } from '@/repositories/rsvp/IRsvpRepository';
import type { RsvpEntity } from '@/types/rsvp/rsvp.dto';

// Mock repository
const mockRsvpRepository: jest.Mocked<IRsvpRepository> = {
  create: jest.fn(),
  findByName: jest.fn(),
};

describe('RsvpService', () => {
  let rsvpService: RsvpService;

  beforeEach(() => {
    jest.clearAllMocks();
    rsvpService = new RsvpService(mockRsvpRepository);
  });

  describe('createRsvp', () => {
    const mockRsvpEntity: RsvpEntity = {
      id: '1',
      nome_completo: 'John Doe',
      contato: '11987654321',
      mensagem: 'Looking forward to the event',
      created_at: new Date(),
      updated_at: new Date(),
    };

    it('should create RSVP successfully', async () => {
      mockRsvpRepository.findByName.mockResolvedValue(null);
      mockRsvpRepository.create.mockResolvedValue(mockRsvpEntity);

      const result = await rsvpService.createRsvp({
        nomeCompleto: 'John Doe',
        contato: '11987654321',
        mensagem: 'Looking forward to the event',
        tipo: 'casamento',
      });

      expect(result).toEqual(mockRsvpEntity);
      expect(mockRsvpRepository.findByName).toHaveBeenCalledWith('John Doe', 'casamento');
      expect(mockRsvpRepository.create).toHaveBeenCalledWith(
        {
          nome_completo: 'John Doe',
          contato: '11987654321',
          mensagem: 'Looking forward to the event',
        },
        'casamento'
      );
    });

    it('should create RSVP without message', async () => {
      mockRsvpRepository.findByName.mockResolvedValue(null);
      mockRsvpRepository.create.mockResolvedValue({
        ...mockRsvpEntity,
        mensagem: null,
      });

      const result = await rsvpService.createRsvp({
        nomeCompleto: 'John Doe',
        contato: '11987654321',
        tipo: 'casamento',
      });

      expect(result.mensagem).toBeNull();
      expect(mockRsvpRepository.create).toHaveBeenCalled();
    });

    it('should throw error if name already exists', async () => {
      mockRsvpRepository.findByName.mockResolvedValue(mockRsvpEntity);

      await expect(
        rsvpService.createRsvp({
          nomeCompleto: 'John Doe',
          contato: '11987654321',
          tipo: 'casamento',
        })
      ).rejects.toThrow('DUPLICATE_NAME');

      expect(mockRsvpRepository.findByName).toHaveBeenCalledWith('John Doe', 'casamento');
      expect(mockRsvpRepository.create).not.toHaveBeenCalled();
    });

    it('should check for duplicate names case-insensitively', async () => {
      mockRsvpRepository.findByName.mockResolvedValue(mockRsvpEntity);

      await expect(
        rsvpService.createRsvp({
          nomeCompleto: 'JOHN DOE',
          contato: '11987654321',
          tipo: 'casamento',
        })
      ).rejects.toThrow('DUPLICATE_NAME');

      expect(mockRsvpRepository.findByName).toHaveBeenCalledWith('JOHN DOE', 'casamento');
    });

    it('should create RSVP for cha-panela event', async () => {
      mockRsvpRepository.findByName.mockResolvedValue(null);
      mockRsvpRepository.create.mockResolvedValue(mockRsvpEntity);

      const result = await rsvpService.createRsvp({
        nomeCompleto: 'Jane Doe',
        contato: '11987654321',
        tipo: 'cha-panela',
      });

      expect(result).toEqual(mockRsvpEntity);
      expect(mockRsvpRepository.findByName).toHaveBeenCalledWith('Jane Doe', 'cha-panela');
      expect(mockRsvpRepository.create).toHaveBeenCalledWith(
        {
          nome_completo: 'Jane Doe',
          contato: '11987654321',
          mensagem: undefined,
        },
        'cha-panela'
      );
    });
  });
});
