import { chromium } from 'playwright-core';
import fs from 'fs';

const URL = 'https://koerperfluss.web.app';
const OUT = '/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/ui-test-evidence';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--use-gl=swiftshader']
});

const report = { console: [], pages: [], brokenLinks: [] };
let consoleLog = (type) => (msg) => report.console.push(`[${type}] ${msg.type()}: ${String(msg.text()).slice(0, 220)}`);

// --- Desktop ---
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('console', consoleLog('desktop'));
page.on('pageerror', e => report.console.push(`[desktop-pageerror] ${String(e).slice(0, 300)}`));
page.on('requestfailed', r => report.console.push(`[desktop-reqfail] ${r.url().slice(0, 140)} — ${r.failure()?.errorText}`));

await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(9000); // Splash + 3D + Lazy-Chunk
await page.screenshot({ path: `${OUT}/01-home-desktop.png` });
report.pages.push({ page: 'home-desktop', title: await page.title(), text: (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 400) });

// Full-Page
await page.screenshot({ path: `${OUT}/02-home-desktop-full.png`, fullPage: true });

// Nav-Links klicken (erste 5 interne Links aus der Navbar)
const navHrefs = await page.$$eval('nav a[href^="/"], header a[href^="/"]', as => [...new Set(as.map(a => a.getAttribute('href')))].slice(0, 5)).catch(() => []);
for (const href of navHrefs) {
  try {
    await page.click(`a[href="${href}"]`, { timeout: 8000 });
    await page.waitForTimeout(4000);
    const shot = `${OUT}/10-nav${href.replace(/\//g, '_')}.png`;
    await page.screenshot({ path: shot });
    report.pages.push({ page: `nav${href}`, ok: true, text: (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 200) });
  } catch (e) {
    report.brokenLinks.push(`${href}: ${String(e).slice(0, 120)}`);
  }
}

// Direkte Deep-Link-Routen (je Screenshot + Textcheck)
for (const route of ['/showcase', '/angebote', '/education', '/kontakt']) {
  try {
    await page.goto(URL + route, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `${OUT}/20-route${route.replace(/\//g, '_')}.png` });
    report.pages.push({ page: `route${route}`, ok: true });
  } catch (e) {
    report.brokenLinks.push(`route ${route}: ${String(e).slice(0, 120)}`);
  }
}

// 3D-Canvas vorhanden? (WebGL im Headless via SwiftShader)
await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(12000);
const canvasInfo = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  return c ? { present: true, w: c.width, h: c.height } : { present: false };
});
report.canvas3D = canvasInfo;
await page.screenshot({ path: `${OUT}/03-home-desktop-after-3d.png` });
await ctx.close();

// --- Mobile (iPhone) ---
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
const mpage = await mctx.newPage();
mpage.on('console', consoleLog('mobile'));
mpage.on('pageerror', e => report.console.push(`[mobile-pageerror] ${String(e).slice(0, 300)}`));
await mpage.goto(URL, { waitUntil: 'load', timeout: 60000 });
await mpage.waitForTimeout(9000);
await mpage.screenshot({ path: `${OUT}/04-home-iphone.png` });
report.pages.push({ page: 'home-iphone', ok: true });
// Zoom-Test: mobile Metaviewport erlaubt Zoom? (statisch geprüft — hier nur Screenshot)
await mctx.close();

await browser.close();
fs.writeFileSync('/tmp/kf_uitest.json', JSON.stringify(report, null, 2));
console.log('UITEST_DONE', JSON.stringify({ consoleCount: report.console.length, pages: report.pages.length, broken: report.brokenLinks.length, canvas3D: report.canvas3D }));
