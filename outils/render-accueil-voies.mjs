import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch();
for (const [width,name] of [[1440,'desktop'],[390,'mobile']]) {
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 await page.goto(`file://${root}/site/index.html`,{waitUntil:'load'});
 await page.evaluate(()=>{document.querySelectorAll('img[loading="lazy"]').forEach(img=>img.loading='eager');document.querySelectorAll('.rev,.stag').forEach(el=>el.classList.add('in'));});
 await page.waitForTimeout(500);
 const section=page.locator('#voies');
 await section.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
 await section.screenshot({path:`${root}/_previews/accueil-voies-${name}.png`});
 const imgs=await page.$$eval('#voies img',xs=>xs.map(x=>({src:x.getAttribute('src'),complete:x.complete,naturalWidth:x.naturalWidth,naturalHeight:x.naturalHeight,rect:{w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height}})));
 const metrics=await page.evaluate(()=>({height:document.documentElement.scrollHeight,section:document.querySelector('#voies').getBoundingClientRect().toJSON(),cards:[...document.querySelectorAll('#voies .voie')].map(x=>x.getBoundingClientRect().toJSON())}));
 console.log(name,JSON.stringify({imgs,metrics}));
 await page.close();
}
await browser.close();
