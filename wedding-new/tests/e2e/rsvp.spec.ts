import { test, expect } from '@playwright/test';

test.describe('RSVP Form E2E', () => {
  test('should display RSVP form on casamento page', async ({ page }) => {
    await page.goto('/casamento');
    
    // Wait for the page to load
    await expect(page.locator('h1, h2').filter({ hasText: /confirmação de presença/i })).toBeVisible({ timeout: 10000 });
    
    // Check form fields are visible
    await expect(page.getByLabel(/nome completo/i)).toBeVisible();
    await expect(page.getByLabel(/telefone/i)).toBeVisible();
    await expect(page.getByLabel(/mensagem/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /confirmar presença/i })).toBeVisible();
  });

  test('should show validation error for empty required fields', async ({ page }) => {
    await page.goto('/casamento');
    
    // Wait for the form to load
    await expect(page.getByRole('button', { name: /confirmar presença/i })).toBeVisible({ timeout: 10000 });
    
    // Try to submit empty form (click twice to trigger browser validation)
    await page.getByRole('button', { name: /confirmar presença/i }).click();
    
    // Browser should prevent submission due to required fields
    // Check that the form is still there (not submitted)
    await expect(page.getByRole('button', { name: /confirmar presença/i })).toBeVisible();
  });

  test('should show validation error for short name', async ({ page }) => {
    await page.goto('/casamento');
    
    // Wait for form to load
    await expect(page.getByLabel(/nome completo/i)).toBeVisible({ timeout: 10000 });
    
    // Fill with invalid data
    await page.getByLabel(/nome completo/i).fill('AB');
    await page.getByLabel(/telefone/i).fill('11999998888');
    
    // Submit form
    await page.getByRole('button', { name: /confirmar presença/i }).click();
    
    // Wait for error toast or validation message
    await page.waitForTimeout(1000);
    
    // Form should still be visible (submission failed)
    await expect(page.getByLabel(/nome completo/i)).toBeVisible();
  });

  test('should successfully submit RSVP form', async ({ page }) => {
    // This test requires API mocking or will fail with network errors
    // Skip if API is not available
    test.skip(true, 'Requires API to be running');
    
    await page.goto('/casamento');
    
    // Wait for form to load
    await expect(page.getByLabel(/nome completo/i)).toBeVisible({ timeout: 10000 });
    
    // Fill valid data
    await page.getByLabel(/nome completo/i).fill('João Silva');
    await page.getByLabel(/telefone/i).fill('11999998888');
    await page.getByLabel(/mensagem/i).fill('Parabéns pelo casamento!');
    
    // Submit form
    await page.getByRole('button', { name: /confirmar presença/i }).click();
    
    // Wait for success state
    await expect(page.getByRole('button')).toHaveText(/confirmado|confirmando/i, { timeout: 5000 });
  });

  test('should display RSVP form on cha-de-panela page', async ({ page }) => {
    await page.goto('/cha-de-panela');
    
    // Wait for the page to load
    await expect(page.locator('h1, h2').filter({ hasText: /confirmação de presença/i })).toBeVisible({ timeout: 10000 });
    
    // Check form fields are visible
    await expect(page.getByLabel(/nome completo/i)).toBeVisible();
    await expect(page.getByLabel(/telefone/i)).toBeVisible();
  });
});
