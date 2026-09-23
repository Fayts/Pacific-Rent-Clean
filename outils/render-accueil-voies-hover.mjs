import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch();
for (const [width,name] of [[1440,'desktop'],[390,'mobile']]) {
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 await page.goto(`file://${root}/site/index.html`,{waitUntil:'load'});
 await page.evaluate(()=>{document.querySelectorAll('img[loading="lazy"]').forEach(i=>i.loading='eager');document.querySelectorAll('.rev,.stag').forEach(e=>e.classList.add('in'));});
 await page.waitForTimeout(500);
 const section=page.locator('#voies'); await section.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
 await section.screenshot({path:`${root}/_previews/accueil-voies-${name}.png`});
 const hover=page.locator('.voie-home'); await hover.hover(); await page.waitForTimeout(800); await section.screenshot({path:`${root}/_previews/accueil-voies-hover-${name}.png`});
 await page.mouse.move(5,5); await page.waitForTimeout(800);
}
await browser.close();
