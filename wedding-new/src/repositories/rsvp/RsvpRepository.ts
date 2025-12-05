import { PrismaClient } from '@/generated/prisma';
import type { EventType } from '@/types/common';
import type { RsvpEntity } from '@/types/rsvp/rsvp.dto';
import type { IRsvpRepository } from './IRsvpRepository';

/**
 * RSVP Repository Implementation using Prisma
 * Handles data access for RSVP confirmations in PostgreSQL database
 */
export class RsvpRepository implements IRsvpRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: {
      nome_completo: string;
      contato: string;
      mensagem?: string | null;
    },
    tipo: EventType
  ): Promise<RsvpEntity> {
    if (tipo === 'casamento') {
      return await this.prisma.rsvpCasamento.create({
        data: {
          nome_completo: data.nome_completo,
          contato: data.contato,
          mensagem: data.mensagem || null,
        },
      });
    } else {
      return await this.prisma.rsvpChaPanela.create({
        data: {
          nome_completo: data.nome_completo,
          contato: data.contato,
          mensagem: data.mensagem || null,
        },
      });
    }
  }

  async findByName(name: string, tipo: EventType): Promise<RsvpEntity | null> {
    if (tipo === 'casamento') {
      return await this.prisma.rsvpCasamento.findFirst({
        where: {
          nome_completo: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });
    } else {
      return await this.prisma.rsvpChaPanela.findFirst({
        where: {
          nome_completo: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });
    }
  }
}
