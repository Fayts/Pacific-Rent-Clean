import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('file://'+resolve(root,'site/location.html'),{waitUntil:'load'});
await page.evaluate(async()=>{for(const img of document.images)img.loading='eager';for(let y=0;y<document.body.scrollHeight;y+=300){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}scrollTo(0,0);await new Promise(r=>setTimeout(r,500));document.querySelectorAll('.nav').forEach(e=>e.style.display='none')});
const data=await page.evaluate(()=>({
 order:[...document.querySelectorAll('main > *')].map(e=>({tag:e.tagName,id:e.id,cls:e.className})),
 methodLabel:document.querySelector('#methode .mono')?.textContent.trim(),
 methodTitle:document.querySelector('#methode .title')?.textContent.trim().replace(/\s+/g,' '),
 plans:[...document.querySelectorAll('#forfaits .plan')].map(e=>e.innerText.trim()),
 faq:[...document.querySelectorAll('#faq-location .q')].map(e=>({q:e.querySelector('button')?.textContent.trim(),a:e.querySelector('.a')?.textContent.trim(),display:getComputedStyle(e.querySelector('.a')).display})),
 hasOldPrice:document.body.innerText.includes('Livraison 1 500 F'),height:document.body.scrollHeight
}));
for(const [id,name] of [['forfaits','location-forfaits.png'],['kit','location-kit.png'],['methode','location-methode-latest.png'],['livraison','location-livraison.png'],['faq-location','location-faq.png'],['conversion','location-cta.png']]) await page.locator('#'+id).screenshot({path:resolve(root,'_previews',name)});
console.log(JSON.stringify(data,null,2));await browser.close();