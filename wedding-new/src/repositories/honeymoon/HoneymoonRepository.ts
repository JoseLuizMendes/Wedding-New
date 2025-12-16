import { PrismaClient } from '@/generated/prisma';
import type { HoneymoonGoal, Contribution } from '@/generated/prisma';
import type { IHoneymoonRepository } from './IHoneymoonRepository';

/**
 * Honeymoon Repository Implementation using Prisma
 * Handles data access for honeymoon goals and contributions in PostgreSQL database
 */
export class HoneymoonRepository implements IHoneymoonRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getActiveGoal(): Promise<HoneymoonGoal | null> {
    return await this.prisma.honeymoonGoal.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update goal amount with a new contribution
   * This operation is atomic - both the goal update and contribution creation
   * happen in a single database transaction
   */
  async updateGoalAmount(
    amount: number,
    transactionId: string,
    contributorName?: string
  ): Promise<HoneymoonGoal> {
    return await this.prisma.$transaction(async (tx) => {
      // Find the active goal
      const activeGoal = await tx.honeymoonGoal.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      if (!activeGoal) {
        throw new Error('ACTIVE_GOAL_NOT_FOUND');
      }

      // Create the contribution record
      await tx.contribution.create({
        data: {
          honeymoonId: activeGoal.id,
          amount,
          transactionId,
          contributorName: contributorName || null,
          paymentStatus: 'approved',
        },
      });

      // Update the goal's current amount
      const updatedGoal = await tx.honeymoonGoal.update({
        where: { id: activeGoal.id },
        data: {
          currentAmount: {
            increment: amount,
          },
        },
      });

      return updatedGoal;
    });
  }

  async getContributions(): Promise<Contribution[]> {
    return await this.prisma.contribution.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        honeymoon: true,
      },
    });
  }

  async getContributionByTransactionId(
    transactionId: string
  ): Promise<Contribution | null> {
    return await this.prisma.contribution.findUnique({
      where: { transactionId },
    });
  }

  async createPendingContribution(data: {
    amount: number;
    contributorName?: string | null;
    mercadoPagoPreferenceId: string;
  }): Promise<Contribution> {
    return await this.prisma.$transaction(async (tx) => {
      // Find the active goal
      const activeGoal = await tx.honeymoonGoal.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      if (!activeGoal) {
        throw new Error('ACTIVE_GOAL_NOT_FOUND');
      }

      // Create the pending contribution
      return await tx.contribution.create({
        data: {
          honeymoonId: activeGoal.id,
          amount: data.amount,
          contributorName: data.contributorName || null,
          transactionId: `pending-${data.mercadoPagoPreferenceId}`,
          paymentStatus: 'pending',
          mercadoPagoPreferenceId: data.mercadoPagoPreferenceId,
        },
      });
    });
  }

  async approveContribution(
    mercadoPagoPreferenceId: string,
    transactionId: string
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Find the pending contribution
      const contribution = await tx.contribution.findUnique({
        where: { mercadoPagoPreferenceId },
      });

      if (!contribution) {
        throw new Error('CONTRIBUTION_NOT_FOUND');
      }

      // Update contribution status and transaction ID
      await tx.contribution.update({
        where: { mercadoPagoPreferenceId },
        data: {
          paymentStatus: 'approved',
          transactionId: transactionId,
        },
      });

      // Increment the goal's current amount
      await tx.honeymoonGoal.update({
        where: { id: contribution.honeymoonId },
        data: {
          currentAmount: {
            increment: Number(contribution.amount),
          },
        },
      });
    });
  }

  async deletePendingContribution(
    mercadoPagoPreferenceId: string
  ): Promise<void> {
    await this.prisma.contribution.deleteMany({
      where: {
        mercadoPagoPreferenceId,
        paymentStatus: 'pending',
      },
    });
  }

  async getContributionByPreferenceId(
    mercadoPagoPreferenceId: string
  ): Promise<Contribution | null> {
    return await this.prisma.contribution.findUnique({
      where: { mercadoPagoPreferenceId },
    });
  }
}
