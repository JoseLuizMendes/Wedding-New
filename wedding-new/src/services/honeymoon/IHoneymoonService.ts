/**
 * Honeymoon Service Interface
 * Defines the business logic contract for honeymoon-related operations
 */
export interface IHoneymoonService {
  /**
   * Calculate progress of the honeymoon goal
   */
  calculateProgress(): Promise<{
    targetAmount: number;
    currentAmount: number;
    percentage: number;
    isActive: boolean;
    contributionsCount: number;
  }>;

  /**
   * Process a new contribution
   * @param amount - Contribution amount
   * @param transactionId - Mercado Pago transaction ID
   * @param contributorName - Optional contributor name
   */
  processContribution(
    amount: number,
    transactionId: string,
    contributorName?: string
  ): Promise<void>;
}
