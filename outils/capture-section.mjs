const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  // Desktop
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('file://' + path.resolve('./site/index.html'), { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    // Ensure images load
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach(img => { if (!img.complete) img.loading = 'eager'; });
    });
    await page.waitForLoadState('networkidle');
    const el = page.locator('.machine-2d');
    await el.waitFor({ state: 'visible', timeout: 5000 });
    // Scroll to center element
    await el.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'center' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.resolve('./_previews/machine-section-desktop-final.png') });
    await context.close();
  }
  // Mobile
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('file://' + path.resolve('./site/index.html'), { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach(img => { if (!img.complete) img.loading = 'eager'; });
    });
    await page.waitForLoadState('networkidle');
    const el = page.locator('.machine-2d');
    await el.waitFor({ state: 'visible', timeout: 5000 });
    await el.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'center' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.resolve('./_previews/machine-section-mobile-final.png') });
    await context.close();
  }
  await browser.close();
  console.log('Section screenshots saved');
})();