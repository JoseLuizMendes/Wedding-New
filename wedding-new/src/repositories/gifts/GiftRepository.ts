import { PrismaClient } from '@/generated/prisma';
import type { EventType } from '@/types/common';
import type { GiftEntity } from '@/types/gifts/gift.dto';
import type { IGiftRepository } from './IGiftRepository';

/**
 * Gift Repository Implementation using Prisma
 * Handles data access for gifts in PostgreSQL database
 */
export class GiftRepository implements IGiftRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEventType(tipo: EventType): Promise<GiftEntity[]> {
    if (tipo === 'casamento') {
      return await this.prisma.presentesCasamento.findMany({
        orderBy: { ordem: 'asc' },
      });
    } else {
      return await this.prisma.presentesChaPanela.findMany({
        orderBy: { ordem: 'asc' },
      });
    }
  }

  async findById(id: string, tipo: EventType): Promise<GiftEntity | null> {
    if (tipo === 'casamento') {
      return await this.prisma.presentesCasamento.findUnique({
        where: { id },
      });
    } else {
      return await this.prisma.presentesChaPanela.findUnique({
        where: { id },
      });
    }
  }

  async reserve(
    id: string,
    tipo: EventType,
    data: {
      reserved_by: string;
      reserved_phone_hash: string;
      reserved_phone_display: string;
      reserved_at: Date;
      reserved_until: Date;
      telefone_contato: string;
    }
  ): Promise<GiftEntity> {
    if (tipo === 'casamento') {
      return await this.prisma.presentesCasamento.update({
        where: { id },
        data: {
          reservado: true,
          reserved_by: data.reserved_by,
          reserved_phone_hash: data.reserved_phone_hash,
          reserved_phone_display: data.reserved_phone_display,
          reserved_at: data.reserved_at,
          reserved_until: data.reserved_until,
          telefone_contato: data.telefone_contato,
        },
      });
    } else {
      return await this.prisma.presentesChaPanela.update({
        where: { id },
        data: {
          reservado: true,
          reserved_by: data.reserved_by,
          reserved_phone_hash: data.reserved_phone_hash,
          reserved_phone_display: data.reserved_phone_display,
          reserved_at: data.reserved_at,
          reserved_until: data.reserved_until,
          telefone_contato: data.telefone_contato,
        },
      });
    }
  }

  async cancelReservation(id: string, tipo: EventType): Promise<GiftEntity> {
    if (tipo === 'casamento') {
      return await this.prisma.presentesCasamento.update({
        where: { id },
        data: {
          reservado: false,
          reserved_by: null,
          reserved_phone_hash: null,
          reserved_phone_display: null,
          reserved_at: null,
          reserved_until: null,
          telefone_contato: null,
        },
      });
    } else {
      return await this.prisma.presentesChaPanela.update({
        where: { id },
        data: {
          reservado: false,
          reserved_by: null,
          reserved_phone_hash: null,
          reserved_phone_display: null,
          reserved_at: null,
          reserved_until: null,
          telefone_contato: null,
        },
      });
    }
  }

  async markAsPurchased(id: string, tipo: EventType): Promise<GiftEntity> {
    if (tipo === 'casamento') {
      return await this.prisma.presentesCasamento.update({
        where: { id },
        data: {
          is_bought: true,
          purchased_at: new Date(),
        },
      });
    } else {
      return await this.prisma.presentesChaPanela.update({
        where: { id },
        data: {
          is_bought: true,
          purchased_at: new Date(),
        },
      });
    }
  }

  /**
   * Mark a gift as purchased by transaction ID (from Mercado Pago webhook)
   * This is used when processing webhook notifications to mark gifts as purchased
   * without requiring a reservation code
   */
  async markAsPurchasedByTransaction(
    giftId: string,
    tipo: EventType,
    transactionId: string,
    contributorName?: string
  ): Promise<GiftEntity> {
    if (tipo === 'casamento') {
      return await this.prisma.presentesCasamento.update({
        where: { id: giftId },
        data: {
          is_bought: true,
          purchased_at: new Date(),
          transaction_id: transactionId,
          purchased_by: contributorName || null,
        },
      });
    } else {
      return await this.prisma.presentesChaPanela.update({
        where: { id: giftId },
        data: {
          is_bought: true,
          purchased_at: new Date(),
          transaction_id: transactionId,
          purchased_by: contributorName || null,
        },
      });
    }
  }

  /**
   * Check if a reservation code is unique across all gifts
   * Note: This performs two separate queries. For larger datasets,
   * consider optimizing with a single query or dedicated code table.
   */
  async isCodeUnique(code: string): Promise<boolean> {
    const [existingCasamento, existingChaPanela] = await Promise.all([
      this.prisma.presentesCasamento.findFirst({
        where: { telefone_contato: code },
      }),
      this.prisma.presentesChaPanela.findFirst({
        where: { telefone_contato: code },
      }),
    ]);

    return !existingCasamento && !existingChaPanela;
  }
}
