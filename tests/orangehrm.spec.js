import { test, expect } from '@playwright/test';

test.describe('OrangeHRM Tests', () => {
    test('Login and Navigate to Leave Calendar', async ({ page }) => {
        // Navigate to OrangeHRM
        await page.goto('https://opensource-demo.orangehrmlive.com/');
        console.log("login started
        // Wait for the page to load and verify we're on the login page
        await expect(page.locator('.orangehrm-login-title')).toBeVisible();
        
        // Login with demo credentials
        await page.locator('input[name="username"]').fill('Admin');
        await page.locator('input[name="password"]').fill('admin123');
        await page.locator('button[type="submit"]').click();
        
        // Wait for dashboard to load and verify successful login
        await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();
        
        // Click on Leave in the main menu
        await page.locator('a').filter({ has: page.getByText('Leave') }).click();
        
        // Wait for Leave page to load
        await expect(page.locator('.oxd-topbar-header-breadcrumb-module')).toHaveText('Leave');
        
        // Ensure we're on the Apply Leave or Leave List page
        await page.waitForLoadState('networkidle');
        
        // Find and click the To Date field
        const toDateContainer = page.locator('.oxd-date-input').nth(1);
        await expect(toDateContainer).toBeVisible();
        
        // Click the calendar icon for the To Date
        const calendarIcon = toDateContainer.locator('.oxd-date-input-icon');
        await calendarIcon.click();
        
        // Verify calendar popup is visible
        await expect(page.locator('.oxd-calendar-wrapper')).toBeVisible();
        
        // Optional: Log success message
        console.log('Successfully opened the To Date calendar in Leave section');
    });

    test('Verify Leave Page Elements', async ({ page }) => {
        // Navigate to OrangeHRM
        await page.goto('https://opensource-demo.orangehrmlive.com/');
        
        // Login
        await page.locator('input[name="username"]').fill('Admin');
        await page.locator('input[name="password"]').fill('admin123');
        await page.locator('button[type="submit"]').click();
        
        // Navigate to Leave page
        await page.locator('a').filter({ has: page.getByText('Leave') }).click();
        
        // Verify essential elements are present
        await expect(page.locator('.oxd-topbar-header-breadcrumb-module')).toHaveText('Leave');
        await expect(page.getByText('Leave List')).toBeVisible();
        await expect(page.getByText('Apply')).toBeVisible();
        
        // Verify date input fields
        const fromDateInput = page.locator('.oxd-date-input').first();
        const toDateInput = page.locator('.oxd-date-input').nth(1);
        
        await expect(fromDateInput).toBeVisible();
        await expect(toDateInput).toBeVisible();
        console.log('Leave page elements verified successfully');
    });
});
