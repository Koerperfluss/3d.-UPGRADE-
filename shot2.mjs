import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('https://koerperfluss.web.app', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(15000);
const info = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  if (!c) return { present: false };
  const r = c.getBoundingClientRect();
  const style = getComputedStyle(c.parentElement);
  // Was liegt an der Stelle rechts (x=1250,y=450) oben drauf?
  const el = document.elementFromPoint(1250, 450);
  const chain = [];
  let n = el;
  while (n && chain.length < 6) { chain.push(n.tagName + '.' + String(n.className).slice(0, 60)); n = n.parentElement; }
  return { present: true, rect: { x: r.x, y: r.y, w: r.width, h: r.height }, parentZ: style.zIndex, parentPos: style.position, topElementAt1250x450: chain };
});
console.log(JSON.stringify(info, null, 1));
await page.locator('canvas').first().screenshot({ path: '/work/ui-test-evidence/98-canvas-only.png' }).catch(e => console.log('shot-fail', e.message));
await browser.close();
console.log('SHOT2_DONE');
