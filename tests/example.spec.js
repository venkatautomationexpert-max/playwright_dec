// @ts-check
import { test, expect } from '@playwright/test';

// Test data for different user scenarios
const users = [
  {
    username: 'standard_user',
    password: 'secret_sauce',
    expectedUrl: 'https://www.saucedemo.com/inventory.html'
  },
  {
    username: 'locked_out_user',
    password: 'secret_sauce',
    expectedError: 'Epic sadface: Sorry, this user has been locked out.'
  },
  {
    username: 'problem_user',
    password: 'secret_sauce',
    expectedUrl: 'https://www.saucedemo.com/inventory.html'
  }
];

// Test data for products
const products = [
  { name: 'Sauce Labs Backpack', price: '$29.99' },
  { name: 'Sauce Labs Bike Light', price: '$9.99' },
  { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' }
];

test.describe('Sauce Labs E-commerce Tests', () => {
  // Test different user login scenarios
  for (const user of users) {
    test(`Login test - ${user.username}`, async ({ page }) => {
      await page.goto('https://www.saucedemo.com/', { waitUntil: 'networkidle' });
      
      await page.fill('[data-test="username"]', user.username);
      await page.fill('[data-test="password"]', user.password);
      await page.click('[data-test="login-button"]');

      if (user.expectedError) {
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(user.expectedError);
      } else if (user.expectedUrl) {
        await expect(page).toHaveURL(user.expectedUrl);
        await expect(page.locator('.inventory_list')).toBeVisible();
      }
    });
  }

  // Test adding different products to cart (using standard_user)
  for (const product of products) {
    test(`Add to cart test - ${product.name}`, async ({ page }) => {
      // Login first
      await page.goto('https://www.saucedemo.com/', { waitUntil: 'networkidle' });
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      
      // Wait for inventory page to load
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      await expect(page.locator('.inventory_list')).toBeVisible();

      // Find and add specific product
      const productItem = page.locator('.inventory_item', {
        has: page.locator('.inventory_item_name', { hasText: product.name })
      });
      await expect(productItem).toBeVisible();

      // Verify product price
      const priceElement = productItem.locator('.inventory_item_price');
      await expect(priceElement).toHaveText(product.price);

      // Add to cart
      await productItem.locator('[data-test="add-to-cart"]').click();

    

      // Verify cart badge
      const cartBadge = page.locator('.shopping_cart_badge');
      await expect(cartBadge).toBeVisible();
      await expect(cartBadge).toHaveText('1');

      // Go to cart and verify
      await page.click('.shopping_cart_link');
      await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

      // Verify product in cart
      const cartItem = page.locator('.cart_item', {
        has: page.locator('.inventory_item_name', { hasText: product.name })
      });
      await expect(cartItem).toBeVisible();
      await expect(cartItem.locator('.inventory_item_price')).toHaveText(product.price);
    });
  }

  // Test complete checkout flow with multiple items
  test('Complete checkout flow with multiple items', async ({ page }) => {
    // Login
    await page.goto('https://www.saucedemo.com/', { waitUntil: 'networkidle' });
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Add all test products to cart
    for (const product of products) {
      const addButton = page.locator('button[data-test^="add-to-cart"]', {
        has: page.locator('.inventory_item_name', { hasText: product.name })
      });
      await addButton.click();
    }


    
    // Verify cart count
    await expect(page.locator('.shopping_cart_badge')).toHaveText(String(products.length));

    // Go to cart
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // Proceed to checkout
    await page.click('[data-test="checkout"]');

    // Fill checkout information
    await page.fill('[data-test="firstName"]', 'Test');
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');

    // Verify checkout overview
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    
      // Verify all products are in the overview
    for (const product of products) {
      const item = page.locator('.cart_item', {
        has: page.locator('.inventory_item_name', { hasText: product.name })
      });
      await expect(item).toBeVisible();
      await expect(item.locator('.inventory_item_price')).toHaveText(product.price);
    }

    // Complete checkout
    await page.click('[data-test="finish"]');

    // Verify success
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });
});
