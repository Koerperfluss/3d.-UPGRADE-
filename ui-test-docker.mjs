// Interaktiver UI/UX-Test im Docker-Container (User-Kontext-Netzwerk)
// Tests: Konsole/Errors, Navigation, Login-Flow (Fehlerfall), Mobile-Viewport, 3D-Canvas
import { chromium } from 'playwright-core';
import fs from 'fs';

const URL = process.env.TARGET_URL || 'https://koerperfluss.web.app';
const OUT = '/work/ui-test-evidence';
fs.mkdirSync(OUT, { recursive: true });

const report = { console: [], pages: [], flows: [] };
const hook = (pg, tag) => {
  
  pg.on("console", m => { if (['error', 'warning'].includes(m.type())) report.console.push(`[${tag}-console-${m.type()}] ${String(m.text()).slice(0, 200)}`); });
  pg.on("pageerror", e => report.console.push(`[${tag}-pageerror] ${String(e).slice(0, 250)}`));
  pg.on("requestfailed", r => report.console.push(`[${tag}-reqfail] ${r.url().slice(0, 130)} (${r.failure()?.errorText})`));
};

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });

// ---------- DESKTOP ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
hook(page, 'desktop');
await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(10000); // Splash + Lazy-3D
await page.screenshot({ path: `${OUT}/01-home-desktop.png` });
report.pages.push({ p: 'home', title: await page.title(), text: (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 300) });

// 3D-Canvas da?
report.canvas3D = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  const gl = c && (c.getContext('webgl2') || c.getContext('webgl'));
  return { present: !!c, webgl: !!gl, w: c?.width || 0 };
});
await page.screenshot({ path: `${OUT}/02-home-after-3d.png` });

// Navbar-Links durchklicken
const navHrefs = await page.$$eval('nav a[href^="/"], header a[href^="/"]', as => [...new Set(as.map(a => a.getAttribute('href')))].filter(Boolean).slice(0, 6)).catch(() => []);
for (const href of navHrefs) {
  try {
    await page.goto(URL + href, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(3500);
    const slug = href.replace(/\//g, '_');
    await page.screenshot({ path: `${OUT}/10-nav${slug}.png` });
    report.pages.push({ p: href, ok: true, text: (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 150) });
  } catch (e) {
    report.flows.push(`NAV-FAIL ${href}: ${String(e).slice(0, 100)}`);
  }
}

// Login-Flow mit FALSCHEM Passwort (Empathie-Persona: frustrierter User)
try {
  await page.goto(URL + '/login', { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(3000);
  const email = page.locator('input[type="email"], input[name*="email" i]').first();
  const pass = page.locator('input[type="password"]').first();
  if (await email.count() && await pass.count()) {
    await email.fill('test@ungueltig.tld');
    await pass.fill('FalschesPasswort123!');
    await Promise.all([
      page.waitForTimeout(5000),
      page.locator('button[type="submit"], button:has-text("Anmelden"), button:has-text("Login")').first().click({ timeout: 8000 }).catch(() => {})
    ]);
    await page.screenshot({ path: `${OUT}/30-login-wrong-creds.png` });
    const bodyAfter = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
    report.flows.push(`LOGIN-WRONG-CREDS: Reaktion sichtbar: ${/fehler|falsch|invalid|error|ungültig/i.test(bodyAfter) ? 'JA' : 'PRÜFEN'} — Textprobe: ${bodyAfter.slice(0, 120)}`);
  } else {
    report.flows.push('LOGIN: Keine Email/Passwort-Felder gefunden (evtl. other flow)');
    await page.screenshot({ path: `${OUT}/31-login-page.png` });
  }
} catch (e) {
  report.flows.push(`LOGIN-FAIL: ${String(e).slice(0, 120)}`);
}
await ctx.close();

// ---------- MOBILE ----------
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mpage = await mctx.newPage();
hook(mpage, 'mobile');
await mpage.goto(URL, { waitUntil: 'load', timeout: 60000 });
await mpage.waitForTimeout(9000);
await mpage.screenshot({ path: `${OUT}/40-home-iphone.png` });
// Mobile Nav (Hamburger?) 
const burger = mpage.locator('button[aria-label*="menu" i], button[aria-label*="Menü"], nav button').first();
if (await burger.count()) {
  await burger.click({ timeout: 5000 }).catch(() => {});
  await mpage.waitForTimeout(1500);
  await mpage.screenshot({ path: `${OUT}/41-mobile-nav-open.png` });
  report.flows.push('MOBILE-NAV: Hamburger gefunden + geklickt');
} else {
  report.flows.push('MOBILE-NAV: kein Hamburger gefunden');
}
await mctx.close();

await browser.close();
fs.writeFileSync('/work/ui-test-result.json', JSON.stringify(report, null, 2));
console.log('UITEST_DONE', JSON.stringify({ consoleIssues: report.console.length, pages: report.pages.length, flows: report.flows.length, canvas3D: report.canvas3D }));
