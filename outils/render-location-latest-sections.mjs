import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch();
for (const [width,name] of [[1440,'desktop'],[390,'mobile']]) {
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 await page.goto(`file://${root}/site/location.html`,{waitUntil:'load'}); await page.waitForTimeout(700);
 await page.evaluate(()=>document.querySelectorAll('img[loading="lazy"]').forEach(img=>img.loading='eager'));
 await page.locator('#kit').scrollIntoViewIfNeeded();
 await page.locator('#kit').screenshot({path:`${root}/_previews/location-kit-latest-${name}.png`});
 await page.locator('#methode').screenshot({path:`${root}/_previews/location-methode-latest-${name}.png`});
 await page.locator('#livraison').screenshot({path:`${root}/_previews/location-livraison-latest-${name}.png`});
 await page.locator('#faq-location').screenshot({path:`${root}/_previews/location-faq-latest-${name}.png`});
 await page.close();
}
await browser.close(); console.log('captures Location ciblées générées');
