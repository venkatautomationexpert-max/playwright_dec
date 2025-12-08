import path from "path";




export class Utilities {


    constructor(page) {

        this.page = page
        this.usernameField = page.locator('#user-name');
        this.passwordField = page.locator('#password');
        this.loginButton = page.locator('#login-button');   
    }

    async NavigateToURL(url) {

        await this.page.goto(url);
    }

    async EnterUsername(username) {
        await this.usernameField.fill(username);
    }


    async EnterPassword(password) {
        await this.passwordField.fill(password);
    }

    async ClickLogin() {
        await this.loginButton.click();
    }

}

async function safeclick(selector,timeout=3000) {

    try {
        await page.waitForSelector(selector,{timeout:timeout});
        await page.locator(selector).click
           console.log(`✅ Clicked on: ${selector}`);
    }
    catch (error) {
       // console.error(`Failed to click :${selector}`);
        console.error(`❌ Failed to click ${selector}: ${error.message}`);
        await page.screenshot({path:`scrrenshots/click_erroe_$(Date.now()).pnh)`})
    }



}
