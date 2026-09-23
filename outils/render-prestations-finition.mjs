import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch();
for (const [width,name] of [[1440,'desktop'],[390,'mobile']]) {
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 await page.goto(`file://${root}/site/prestations.html`,{waitUntil:'load'});
 await page.evaluate(()=>{document.querySelectorAll('img[loading="lazy"]').forEach(img=>img.loading='eager');document.querySelectorAll('.rev,.stag').forEach(el=>el.classList.add('in'));});
 await page.waitForTimeout(120);
 await page.screenshot({path:`${root}/_previews/prestations-finition-${name}.png`,fullPage:true,timeout:120000});
 await page.locator('#prestations').screenshot({path:`${root}/_previews/prestations-finition-categories-${name}.png`});
 await page.locator('#prix').screenshot({path:`${root}/_previews/prestations-finition-prix-${name}.png`});
 await page.locator('#faq-prestations').screenshot({path:`${root}/_previews/prestations-finition-faq-${name}.png`});
 await page.locator('#faqPrestationsList button').nth(2).click();
 await page.waitForTimeout(120);
 await page.locator('#faq-prestations').screenshot({path:`${root}/_previews/prestations-finition-faq-open-${name}.png`});
 await page.locator('#conversion').screenshot({path:`${root}/_previews/prestations-finition-cta-${name}.png`});
 const data=await page.evaluate(()=>({height:document.documentElement.scrollHeight,faq:document.querySelectorAll('#faqPrestationsList .q').length,methodLink:[...document.querySelectorAll('a')].some(a=>a.textContent.includes('La méthode en six temps')),svc:[...document.querySelectorAll('.svc')].map(e=>({id:e.id,h:e.getBoundingClientRect().height,img:e.querySelector('.svc-fig')?.getBoundingClientRect().height}))}));
 console.log(name,JSON.stringify(data));
 await page.close();
}
await browser.close();
