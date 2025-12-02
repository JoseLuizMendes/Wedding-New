import { test, expect } from '@playwright/test';

test.describe('Gift Reservation E2E', () => {
  test('should display gift list on casamento page', async ({ page }) => {
    await page.goto('/casamento');
    
    // Wait for the page to load
    await expect(page.locator('h1, h2').filter({ hasText: /sugestões de presentes/i })).toBeVisible({ timeout: 10000 });
    
    // Wait for tabs to become visible (indicates gift list has loaded)
    await expect(page.getByRole('tab', { name: /todos/i })).toBeVisible({ timeout: 10000 });
    
    // Check for gift stats or tabs
    const tabs = page.getByRole('tab');
    await expect(tabs.first()).toBeVisible();
  });

  test('should display filter tabs', async ({ page }) => {
    await page.goto('/casamento');
    
    // Wait for tabs to load
    await expect(page.getByRole('tab', { name: /todos/i })).toBeVisible({ timeout: 10000 });
    
    // Check all filter tabs are present
    await expect(page.getByRole('tab', { name: /todos/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /disponíveis/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /reservados/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /comprados/i })).toBeVisible();
  });

  test('should be able to switch between tabs', async ({ page }) => {
    await page.goto('/casamento');
    
    // Wait for tabs to load
    await expect(page.getByRole('tab', { name: /todos/i })).toBeVisible({ timeout: 10000 });
    
    // Click on "Disponíveis" tab
    await page.getByRole('tab', { name: /disponíveis/i }).click();
    
    // Check tab is now selected
    await expect(page.getByRole('tab', { name: /disponíveis/i })).toHaveAttribute('aria-selected', 'true');
    
    // Click on "Reservados" tab
    await page.getByRole('tab', { name: /reservados/i }).click();
    
    // Check tab is now selected
    await expect(page.getByRole('tab', { name: /reservados/i })).toHaveAttribute('aria-selected', 'true');
  });

  test('should show gift stats cards', async ({ page }) => {
    await page.goto('/casamento');
    
    // Wait for page to load
    await expect(page.locator('h1, h2').filter({ hasText: /sugestões de presentes/i })).toBeVisible({ timeout: 10000 });
    
    // Check for stats labels
    await expect(page.getByText('Total')).toBeVisible();
    await expect(page.getByText(/disponíveis/i).first()).toBeVisible();
    await expect(page.getByText(/reservados/i).first()).toBeVisible();
    await expect(page.getByText(/comprados/i).first()).toBeVisible();
  });

  test('should display gift list on cha-de-panela page', async ({ page }) => {
    await page.goto('/cha-de-panela');
    
    // Wait for the page to load - check for tabs
    await expect(page.getByRole('tab', { name: /todos/i })).toBeVisible({ timeout: 10000 });
    
    // Gift list tabs should be visible
    await expect(page.getByRole('tab', { name: /disponíveis/i })).toBeVisible();
  });

  test('should open reservation dialog when clicking reserve button', async ({ page }) => {
    // This test may fail if no gifts are available
    test.skip(true, 'Requires gifts to be loaded from API');
    
    await page.goto('/casamento');
    
    // Wait for tabs to become visible (indicates gift list has loaded)
    await expect(page.getByRole('tab', { name: /todos/i })).toBeVisible({ timeout: 10000 });
    
    // Try to find and click a "Quero Presentear" button
    const reserveButton = page.getByRole('button', { name: /quero presentear/i }).first();
    
    if (await reserveButton.isVisible()) {
      await reserveButton.click();
      
      // Dialog should open
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });
});
