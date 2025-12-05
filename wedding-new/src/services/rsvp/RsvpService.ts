import type { EventType } from '@/types/common';
import type { CreateRsvpDTO, RsvpEntity } from '@/types/rsvp/rsvp.dto';
import type { IRsvpRepository } from '@/repositories/rsvp/IRsvpRepository';
import type { IRsvpService } from './IRsvpService';

/**
 * RSVP Service Implementation
 * Contains business logic for RSVP confirmation management
 * Receives repository via Dependency Injection
 */
export class RsvpService implements IRsvpService {
  constructor(private readonly rsvpRepository: IRsvpRepository) {}

  async createRsvp(dto: CreateRsvpDTO): Promise<RsvpEntity> {
    // Check for duplicate name (case-insensitive)
    const existingRsvp = await this.rsvpRepository.findByName(
      dto.nomeCompleto,
      dto.tipo
    );

    if (existingRsvp) {
      throw new Error('DUPLICATE_NAME');
    }

    // Create the RSVP
    const rsvp = await this.rsvpRepository.create(
      {
        nome_completo: dto.nomeCompleto,
        contato: dto.contato,
        mensagem: dto.mensagem,
      },
      dto.tipo
    );

    return rsvp;
  }
}
