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
 await section.screenshot({path:`${root}/_previews/accueil-voies-final-${name}.png`});
 await page.locator('.voie-home').hover(); await page.waitForTimeout(800);
 await section.screenshot({path:`${root}/_previews/accueil-voies-final-hover-${name}.png`});
 const data=await page.evaluate(()=>({title:document.querySelector('#voies .fork-head h2')?.innerText,locationTitle:document.querySelector('.voie-rental h3')?.innerText,section:document.querySelector('#voies').getBoundingClientRect().toJSON(),heading:document.querySelector('#voies .fork-head').getBoundingClientRect().toJSON(),imgs:[...document.querySelectorAll('#voies img')].map(i=>({src:i.getAttribute('src'),complete:i.complete,naturalWidth:i.naturalWidth}))}));
 console.log(name,JSON.stringify(data)); await page.close();
}
await browser.close();
