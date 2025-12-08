


import { test, expect } from '@playwright/test';
import { error, time } from 'console';


const user = [


    {
        username: 'standard_user',
        password: 'secret_sauce',
        expectedUrl: 'https://www.saucedemo.com/inventory.html'
    },

    {
        username: 'locked_out_user',
        password: ' secret_sauce',
        expectedError: 'Epic sadface: Sorry, this user has been locked out.'
    },
    {
        username: 'problem_user',
        password: 'secret_sauce',
        expectedUrl: 'https://www.saucedemo.com/inventory.html'
    }



];





const products = [
    {
        name: 'Sauce Labs Backpack',
        price: '$29.99'
    },
    {
        name: 'Sauce Labs Bike Light',
        price: '$9.99'
    },
    {
        name: 'Sauce Labs Bolt T-Shirt',
        price: '$15.99'
    }

];

test.describe('Data Driven Tests for Sauce Demo', () => {



    for (const usr of user) {

        test(`login test for ${usr.username}`, async ({ page }) => {



            await page.goto("https://www.saucedemo.com/", { networkIdle: true });
            await page.locator('[data-test="username"]').fill(usr.username);
            await page.locator('[data-test="password"]').fill(usr.password);
            await page.locator('[data-test="login-button"]').click();
            await page.waitForLoadState('networkidle');


            if (user.expectedError) {

                const errorMessage = page.locator('[data-test="error"]');
                await expect(errorMessage).toBeVisible();
                await expect(errorMessage).toHaveText(usr.expectedError);

            }
            else if (usr.expectedUrl) {
                await expect(page).toHaveURL(usr.expectedUrl);
                await expect(page.locator('.inventory_list')).toBeVisible();
            }

        })
    }
}



)






for (const prod of products) {

    test(`Add to cart test - ${prod.name}`, async ({ page }) => {
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


    })

}



test('Sample test to verify test structure', async ({ page }) => {


    try {

        await page.goto('https://example.com');
    }
    catch (error) {
        console.error('Error navigating to the page:', error);
    }
})


test.beforeEach(async ({ page }, testInfo) => {

    if (testInfo.status !== testInfo.expectedStatus) {
        console.log(`test failed :${testInfo.title}`)
        await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
})



test("Sample test to demonstrate beforeEach hook", async ({ page }) => {

    // page.on('console',messgage =>
    //     console.log('browser console log',messgage.text)
    // )

    // page.on('pageerror',error =>
    //     console.log('page error',error)

    // )




})


async function safeclick(page, selector) {
    try {


    // Check if login form exists
    const usernameField = page.locator('#username');
    const passwordField = page.locator('#password');
    const loginButton = page.locator('#loginBtn');



    if(!(await usernameField.isVisible()) || !(await passwordField.isVisible()))
    {

        throw new error("Login failed")
    }
        await page.click(selector)
        console.log(`✅  clicked on :${selector}`)

    }
    catch (error)
    {
        console.error(`Failed to click :${selector}`)
    }

}


async function safefill(page,selector,timeout=5000)
{
   

    try {
        await page.waitForSelector(selector,{timeout:timeout});
        await page.fill(selector);
        console.log(`✅  filled :${selector}`);  

    }
    catch(error)
    {
        console.error(`Failed to fill :${selector}`);
    }
}