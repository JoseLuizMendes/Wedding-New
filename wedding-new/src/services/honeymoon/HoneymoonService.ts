import type { IHoneymoonRepository } from '@/repositories/honeymoon/IHoneymoonRepository';
import type { IHoneymoonService } from './IHoneymoonService';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Honeymoon Service Implementation
 * Contains business logic for honeymoon goal management
 * Receives repository via Dependency Injection
 */
export class HoneymoonService implements IHoneymoonService {
  constructor(private readonly honeymoonRepository: IHoneymoonRepository) {}

  async calculateProgress(): Promise<{
    targetAmount: number;
    currentAmount: number;
    percentage: number;
    isActive: boolean;
    contributionsCount: number;
  }> {
    const activeGoal = await this.honeymoonRepository.getActiveGoal();

    if (!activeGoal) {
      return {
        targetAmount: 0,
        currentAmount: 0,
        percentage: 0,
        isActive: false,
        contributionsCount: 0,
      };
    }

    const contributions = await this.honeymoonRepository.getContributions();
    const contributionsForThisGoal = contributions.filter(
      (c) => c.honeymoonId === activeGoal.id
    );

    // Convert Decimal to number for calculations
    const targetAmount = this.decimalToNumber(activeGoal.targetAmount);
    const currentAmount = this.decimalToNumber(activeGoal.currentAmount);

    // Calculate percentage, ensuring it doesn't exceed 100%
    let percentage = 0;
    if (targetAmount > 0) {
      percentage = Math.min((currentAmount / targetAmount) * 100, 100);
      percentage = Math.round(percentage); // Round to nearest integer
    }

    return {
      targetAmount,
      currentAmount,
      percentage,
      isActive: activeGoal.isActive,
      contributionsCount: contributionsForThisGoal.length,
    };
  }

  async processContribution(
    amount: number,
    transactionId: string,
    contributorName?: string
  ): Promise<void> {
    // Check if contribution already exists (idempotency)
    const existingContribution =
      await this.honeymoonRepository.getContributionByTransactionId(
        transactionId
      );

    if (existingContribution) {
      console.log(
        `[HoneymoonService] Contribution ${transactionId} already processed, skipping...`
      );
      return;
    }

    // Process the contribution atomically
    await this.honeymoonRepository.updateGoalAmount(
      amount,
      transactionId,
      contributorName
    );

    console.log(
      `[HoneymoonService] Contribution processed: ${amount} from ${contributorName || 'Anonymous'}`
    );
  }

  /**
   * Helper method to convert Prisma Decimal to number
   */
  private decimalToNumber(decimal: Decimal): number {
    return parseFloat(decimal.toString());
  }
}
