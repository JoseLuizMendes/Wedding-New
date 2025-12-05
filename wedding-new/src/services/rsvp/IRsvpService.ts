import type { EventType } from '@/types/common';
import type { CreateRsvpDTO, RsvpEntity } from '@/types/rsvp/rsvp.dto';

/**
 * RSVP Service Interface
 * Defines business logic operations for RSVP confirmations
 * Follows Dependency Inversion Principle (SOLID)
 */
export interface IRsvpService {
  /**
   * Create a new RSVP confirmation
   * @param dto - RSVP data
   * @returns Created RSVP entity
   * @throws Error if name already exists (duplicate)
   */
  createRsvp(dto: CreateRsvpDTO): Promise<RsvpEntity>;
}
