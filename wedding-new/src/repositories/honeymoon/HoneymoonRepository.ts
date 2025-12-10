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
}
