




import { test, expect } from '@playwright/test';

test.describe('Facebook Login Tests', () => {
    test('Basic Login Page Test', async ({ page }) => {
        // Navigate to Facebook
        await page.goto('https://www.facebook.com/');

        // Handle cookie consent if present
        try {
            const cookieButton = page.getByRole('button', { name: 'Allow all cookies' });
            if (await cookieButton.isVisible()) {
                await cookieButton.click();
            }
        } catch (error) {
            console.log('No cookie consent dialog found');
        }

        // Test invalid login
        await page.fill('#email', 'test@example.com');
        await page.fill('#pass', 'invalidpassword');
        await page.click('[name="login"]');

        // Wait for and verify error message
        const errorMessage = await page.waitForSelector('div[role="alert"]');
        expect(await errorMessage.isVisible()).toBeTruthy();

        // Clear fields and test empty submission
        await page.fill('#email', '');
        await page.fill('#pass', '');
        await page.click('[name="login"]');

        // Verify empty fields error
        const emptyFieldError = await page.waitForSelector('div[role="alert"]');
        expect(await emptyFieldError.isVisible()).toBeTruthy();
    });

    test('UI Elements Validation', async ({ page }) => {
        // Navigate to Facebook
        await page.goto('https://www.facebook.com/');

        // Check main elements visibility
        const elements = {
            emailField: '#email',
            passwordField: '#pass',
            loginButton: '[name="login"]',
            createAccountButton: '[data-testid="open-registration-form-button"]',
            forgotPasswordLink: 'text=Forgotten password?'
        };

        // Verify all elements are visible
        for (const [name, selector] of Object.entries(elements)) {
            await expect(page.locator(selector)).toBeVisible();
        }

        // Check placeholder texts
        await expect(page.locator('#email')).toHaveAttribute('placeholder', 'Email or phone number');
        await expect(page.locator('#pass')).toHaveAttribute('placeholder', 'Password');

        // Verify page title
        await expect(page).toHaveTitle(/Facebook/);
    });

//     test('Input Field Interactions', async ({ page }) => {
//         // Navigate to Facebook
//         await page.goto('https://www.facebook.com/');

//         // Test email field
//         await page.fill('#email', 'test@example.com');
//         await expect(page.locator('#email')).toHaveValue('test@example.com');
        
//         // Test password field
//         await page.fill('#pass', 'testpassword');
//         await expect(page.locator('#pass')).toHaveValue('testpassword');
        
//         // Clear fields
//         await page.fill('#email', '');
//         await page.fill('#pass', '');
        
//         // Verify fields are cleared
//         await expect(page.locator('#email')).toHaveValue('');
//         await expect(page.locator('#pass')).toHaveValue('');
//     });
// });

//     // Note: We're not testing with real credentials as that would be a security risk
//     // and could violate Facebook's terms of service
// });



test.describe('Sauce Demo Login Tests', () => {
    const loginData = [
        {
            scenario: 'Standard User Login',
            username: 'standard_user',
            password: 'secret_sauce',
            expectedUrl: 'https://www.saucedemo.com/inventory.html',
            shouldSucceed: true
        },
        {
            scenario: 'Locked Out User',
            username: 'locked_out_user',
            password: 'secret_sauce',
            errorMessage: 'Epic sadface: Sorry, this user has been locked out.',
            shouldSucceed: false
        },
        {
            scenario: 'Invalid Password',
            username: 'standard_user',
            password: 'wrong_password',
            errorMessage: 'Epic sadface: Username and password do not match any user in this service',
            shouldSucceed: false
        }
    ];

    for (const testCase of loginData) {
        test(`Login Test - ${testCase.scenario}`, async ({ page }) => {
            const Utilitiesobj = new Utilities(page);

            // Navigate to URL
            console.log("Navigate to url");
            await Utilitiesobj.NavigateToURL('https://www.saucedemo.com/');
            
            // Enter credentials
            console.log(`Entering Username: ${testCase.username} and Password: ${testCase.password}`);
            await enterusernamepassword(page, testCase.username, testCase.password);
            
            // Click login button
            await safeclick(page, '#login-button');

            if (testCase.shouldSucceed) {
                // Verify successful login
                console.log("Verifying successful login");
                await expect(page).toHaveURL(testCase.expectedUrl);
                await expect(page.locator('.inventory_list')).toBeVisible();
            } else {
                // Verify error message
                console.log("Verifying error message");
                const errorElement = page.locator('[data-test="error"]');
                await expect(errorElement).toBeVisible();
                await expect(errorElement).toHaveText(testCase.errorMessage);
            }
        });
    }

    test('Login UI Elements Validation', async ({ page }) => {
        const Utilitiesobj = new Utilities(page);
        
        // Navigate to URL
        await Utilitiesobj.NavigateToURL('https://www.saucedemo.com/');
        
        // Verify login form elements
        await expect(page.locator('[data-test="username"]')).toBeVisible();
        await expect(page.locator('[data-test="password"]')).toBeVisible();
        await expect(page.locator('#login-button')).toBeVisible();
        
        // Verify placeholders
        await expect(page.locator('[data-test="username"]')).toHaveAttribute('placeholder', 'Username');
        await expect(page.locator('[data-test="password"]')).toHaveAttribute('placeholder', 'Password');
        
        // Verify logo
        await expect(page.locator('.login_logo')).toBeVisible();
    });
})


export async function fillTextbox(page, selector, value, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    const input = page.locator(selector);

    if (!(await input.isVisible())) {
      throw new Error(`Textbox ${selector} is not visible`);
    }
    if (await input.isDisabled()) {
      throw new Error(`Textbox ${selector} is disabled`);
    }

    await input.fill(''); // clear first
    await input.fill(value);
    console.log(`✍️ Filled "${value}" into ${selector}`);
  } catch (error) {
    console.error(`❌ Error filling textbox ${selector}: ${error.message}`);
    await page.screenshot({ path: `fill-error-${Date.now()}.png`, fullPage: true });
  }
}


/**
 * Fill textbox with typing delay (simulate real user input)
 */
export async function typeTextbox(page, selector, value, delay = 100) {
  try {
    await page.waitForSelector(selector);
    const input = page.locator(selector);
    await input.fill('');
    await input.type(value, { delay });
    console.log(`⌨️ Typed "${value}" into ${selector} with delay ${delay}ms`);
  } catch (error) {
    console.error(`❌ Error typing into ${selector}: ${error.message}`);
  }
}



export async function verifyTextboxValue(page, selector, expectedValue) {
  try {
    const inputValue = await page.locator(selector).inputValue();
    if (inputValue === expectedValue) {
      console.log(`✅ Verified textbox value: "${inputValue}"`);
    } else {
      console.warn(`⚠️ Value mismatch! Expected: "${expectedValue}", Got: "${inputValue}"`);
    }
  } catch (error) {
    console.error(`❌ Error verifying textbox ${selector}: ${error.message}`);
  }
}


