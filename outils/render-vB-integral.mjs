#!/usr/bin/env node
// Capture : bande six temps (vB) intégrée en fin de Prestations ; §procédé masqué.
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
const __dir = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(__dir,'../site/index.html');
const OUT = resolve(__dir,'../_previews'); mkdirSync(OUT,{recursive:true});
const browser = await chromium.launch();
const page = await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('file://'+SITE,{waitUntil:'networkidle',timeout:60000});
await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1200);
const h = await page.evaluate(()=>document.body.scrollHeight);
await page.screenshot({path:resolve(OUT,'vB-integree-page.png'),fullPage:true});
// zoom sur la bande dans son contexte (les svc qui précèdent + la bande)
const box = await page.locator('#bandSix').boundingBox();
await page.evaluate((b)=>{window.scrollTo(0,b.y-520);},{y:box.y});
await page.waitForTimeout(600);
await page.screenshot({path:resolve(OUT,'vB-integree-zoom.png')});
console.log(`hauteur page (avec bande, sans §procédé) = ${h}px`);
console.log(`bande à y=${Math.round(box.y)} h=${Math.round(box.height)}px`);
await browser.close();
