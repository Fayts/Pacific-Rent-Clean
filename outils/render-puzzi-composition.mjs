import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch();
for (const [width,name] of [[1440,'desktop'],[390,'mobile']]) {
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 await page.goto(`file://${root}/site/location.html#kit`,{waitUntil:'load'}); await page.waitForTimeout(700);
 await page.locator('.kit-composition').screenshot({path:`${root}/_previews/puzzi-composition-${name}.png`});
 await page.close();
}
await browser.close(); console.log('composition crops generated');
