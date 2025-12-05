import { EventType } from '@/types/common';
import { RsvpEntity } from '@/types/rsvp/rsvp.dto';

/**
 * RSVP Repository Interface
 * Defines data access operations for RSVP confirmations
 * Follows Dependency Inversion Principle (SOLID)
 */
export interface IRsvpRepository {
  /**
   * Create a new RSVP confirmation
   * @param data - RSVP data
   * @param tipo - Event type
   * @returns Created RSVP entity
   */
  create(
    data: {
      nome_completo: string;
      contato: string;
      mensagem?: string | null;
    },
    tipo: EventType
  ): Promise<RsvpEntity>;

  /**
   * Find an RSVP by name (case-insensitive)
   * @param name - Full name to search
   * @param tipo - Event type
   * @returns RSVP entity or null if not found
   */
  findByName(name: string, tipo: EventType): Promise<RsvpEntity | null>;
}
