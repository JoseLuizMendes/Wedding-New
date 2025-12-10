import type { HoneymoonGoal, Contribution } from '@/generated/prisma';

/**
 * Honeymoon Repository Interface
 * Defines the data access contract for honeymoon-related operations
 */
export interface IHoneymoonRepository {
  /**
   * Get the active honeymoon goal
   */
  getActiveGoal(): Promise<HoneymoonGoal | null>;

  /**
   * Update goal amount with a new contribution (atomic transaction)
   * @param amount - Contribution amount
   * @param transactionId - Mercado Pago transaction ID
   * @param contributorName - Optional contributor name
   */
  updateGoalAmount(
    amount: number,
    transactionId: string,
    contributorName?: string
  ): Promise<HoneymoonGoal>;

  /**
   * Get all contributions
   */
  getContributions(): Promise<Contribution[]>;

  /**
   * Find a contribution by transaction ID
   * @param transactionId - Mercado Pago transaction ID
   */
  getContributionByTransactionId(
    transactionId: string
  ): Promise<Contribution | null>;
}
