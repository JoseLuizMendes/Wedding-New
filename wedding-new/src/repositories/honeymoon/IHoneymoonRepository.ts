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

  /**
   * Create a pending contribution
   * @param data - Contribution data including preference ID
   */
  createPendingContribution(data: {
    amount: number;
    contributorName?: string | null;
    mercadoPagoPreferenceId: string;
  }): Promise<Contribution>;

  /**
   * Approve a contribution by preference ID
   * @param mercadoPagoPreferenceId - Mercado Pago preference ID
   * @param transactionId - Mercado Pago transaction ID
   */
  approveContribution(
    mercadoPagoPreferenceId: string,
    transactionId: string
  ): Promise<void>;

  /**
   * Delete a pending contribution
   * @param mercadoPagoPreferenceId - Mercado Pago preference ID
   */
  deletePendingContribution(mercadoPagoPreferenceId: string): Promise<void>;

  /**
   * Find a contribution by preference ID
   * @param mercadoPagoPreferenceId - Mercado Pago preference ID
   */
  getContributionByPreferenceId(
    mercadoPagoPreferenceId: string
  ): Promise<Contribution | null>;
}
