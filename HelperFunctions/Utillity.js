import path from "path";



export async function safeclick(page, selector,timeout=3000) {

await page.waitForSelector(selector,{timeout:timeout});
    
        try {
    await page.waitForSelector(selector, { timeout });
        await page.click(selector);
           console.log(`✅ Clicked on: ${selector}`);
    }
    catch (error) {
       // console.error(`Failed to click :${selector}`);
        console.error(`❌ Failed to click ${selector}: ${error.message}`);
        await page.screenshot({path:`screenshots/click_error_$(Date.now()).png`})
    }

}
    

export async function  enterusernamepassword(page,username,password){

    const usernameField = page.locator('#user-name');
    const passwordField = page.locator('#password');    
    await usernameField.fill(username);
    await passwordField.fill(password);


}
    


export async function  waitforelement(page,selector,timeout=3000){


    try{

        await page.waitForSelector(selector,{timeout})
        console.log(`Eleemnt found : ${selector}`)
    }

    catch(error){

        console.error(`timeout waitfor :${selector}`)
    }
}


export async function  takescreenshot(page,name="screenshot")
{

const filename=`${name}-${Date.now()}.png`

await page.screenshot({path:filename,fullPage:true})

console.log(`screenshot saved: ${filename}`)


}


// 👉 Safe Fill Function
export async function safeFill(page, selector, value, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.fill(selector, value);
    console.log(`✍️ Filled "${value}" into ${selector}`);
  } catch (error) {
    console.error(`❌ Failed to fill ${selector}: ${error.message}`);
    await takeScreenshot(page, 'fill-error');
  }
}

