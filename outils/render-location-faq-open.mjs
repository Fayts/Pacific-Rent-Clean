import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch();
for (const [width,name] of [[1440,'desktop'],[390,'mobile']]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto('file://'+resolve(root,'site/location.html'),{waitUntil:'load'});
  await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';for(let y=0;y<document.body.scrollHeight;y+=280){scrollTo(0,y);await new Promise(r=>setTimeout(r,35))}scrollTo(0,0);await new Promise(r=>setTimeout(r,400));});
  const faq=page.locator('#faqLocationList .q').first();
  await faq.locator('button').click();
  await page.locator('#faq-location').screenshot({path:resolve(root,'_previews',`location-faq-open-${name}.png`)});
  await page.close();
}
await browser.close();
console.log('FAQ accordéon capturée desktop + mobile avec la première réponse ouverte.');