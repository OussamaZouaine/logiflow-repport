/**
 * Playwright → report screenshots (waits for data + IA online).
 *
 * Prereqs: FE :4200, BE :8080, AI :8000 (health UP), Keycloak if used.
 *
 *   node scripts/capture-screens.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../figures/screenshots');
const BASE = process.env.LOGIFLOW_URL || 'http://localhost:4200';
const USER = process.env.LOGIFLOW_USER || 'admin';
const PASS = process.env.LOGIFLOW_PASS || 'demo';
const VIEWPORT = { width: 1920, height: 1080 };

async function shot(page, name) {
  await page.waitForTimeout(350);
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage: false,
    type: 'png',
  });
  console.log('OK', name);
}

async function goto(page, route) {
  await page.goto(`${BASE}${route}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
}

/** Wait until list/table skeletons are gone (or timeout). */
async function waitNoListSkeleton(page, timeout = 25000) {
  const sk = page.locator('app-list-table-skeleton');
  if (await sk.count()) {
    await sk.first().waitFor({ state: 'detached', timeout }).catch(() => {});
  }
  await page
    .locator('.animate-pulse')
    .first()
    .waitFor({ state: 'detached', timeout: 8000 })
    .catch(() => {});
}

/** Dashboard KPI tiles: no aria-busy left. */
async function waitDashboardReady(page) {
  await page.waitForSelector('.apercu-kpi-grid, main', { timeout: 20000 });
  await page.waitForFunction(
    () => {
      const busy = document.querySelectorAll('[aria-busy="true"]');
      const skeletons = document.querySelectorAll(
        '.file-inbox-skeleton__block, app-list-table-skeleton'
      );
      // Allow empty file-du-jour; block only if KPI cards still loading
      const kpiBusy = document.querySelectorAll(
        '.apercu-kpi-link[aria-busy="true"]'
      );
      return kpiBusy.length === 0 && busy.length === 0;
    },
    { timeout: 30000 }
  ).catch(async () => {
    // Soft fallback: extra settle time
    await page.waitForTimeout(2500);
  });
  // Extra beat for last tiles / charts
  await page.waitForTimeout(800);
  const stillBusy = await page.locator('.apercu-kpi-link[aria-busy="true"]').count();
  if (stillBusy > 0) {
    throw new Error(`Dashboard still has ${stillBusy} loading KPI tile(s)`);
  }
}

async function assertNoText(page, pattern, label) {
  const hit = page.getByText(pattern);
  if (await hit.count()) {
    const t = await hit.first().innerText().catch(() => pattern.source);
    throw new Error(`${label}: unexpected text « ${t.trim().slice(0, 80)} »`);
  }
}

async function signIn(page) {
  await goto(page, '/connexion');

  const adminChip = page.locator('button.sign-in-chip').filter({ hasText: 'admin' });
  if (await adminChip.count()) {
    await adminChip.first().click();
    await page.locator('form button.sign-in-submit[type="submit"]').click();
    await page.waitForURL((u) => !u.pathname.includes('/connexion'), { timeout: 20000 });
    console.log('Signed in (demo UI)');
    return;
  }

  const sso = page.getByRole('button', { name: /Continuer vers la connexion/i });
  if (!(await sso.count())) {
    throw new Error('Unknown connexion page — neither demo chips nor Keycloak button.');
  }

  await sso.click();
  await page.waitForURL(/localhost:8081|\/realms\/logiflow/, { timeout: 20000 });
  await page.waitForSelector('#username, input[name="username"]', { timeout: 15000 });
  await page.locator('#username, input[name="username"]').first().fill(USER);
  await page.locator('#password, input[name="password"]').first().fill(PASS);
  await page.locator('#kc-login, button[type="submit"]').first().click();

  await page.waitForURL(
    (u) => u.origin === 'http://localhost:4200' && !u.pathname.includes('/connexion'),
    { timeout: 30000 }
  );
  await page.waitForTimeout(600);
  console.log('Signed in (Keycloak)');
}

async function navModule(page, name) {
  await page.getByLabel('Modules').getByRole('link', { name, exact: true }).click();
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await waitNoListSkeleton(page);
  await page.waitForTimeout(400);
}

async function openFirstDetail(page, hrefPart) {
  // Exclude /nouveau (create forms) — only real :id detail links
  const link = page
    .locator(`main a[href*="${hrefPart}/"]:not([href*="nouveau"])`)
    .first();
  await link.waitFor({ state: 'visible', timeout: 15000 });
  const href = await link.getAttribute('href');
  if (!href || href.endsWith(hrefPart) || href.includes('nouveau')) {
    throw new Error(`No detail link found under ${hrefPart} (got ${href})`);
  }
  await link.click();
  await page.waitForURL(new RegExp(`${hrefPart}/[^/]+`), { timeout: 15000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);
  // Guard: never keep a "Nouveau …" create form as a detail shot
  const title = await page.locator('main h1, main [class*="title"]').first().innerText().catch(() => '');
  if (/nouveau/i.test(title)) {
    throw new Error(`Landed on create page instead of detail for ${hrefPart}: ${title}`);
  }
}

async function captureCopilote(page) {
  await goto(page, '/');
  await waitDashboardReady(page);

  await page.getByRole('button', { name: /Copilote/i }).click();
  await page.waitForSelector('#app-copilote-panel', { timeout: 10000 });

  // Wait until status is online (retry a few times)
  for (let i = 0; i < 8; i++) {
    const etatBtn = page.locator('#app-copilote-panel .copilote-etat');
    const libelle = ((await etatBtn.innerText().catch(() => '')) || '').trim();
    if (/En ligne/i.test(libelle)) break;
    await page.getByRole('button', { name: /Réessayer|Vérifier/i }).first().click().catch(() => {});
    await page.locator('#app-copilote-panel .copilote-etat').click().catch(() => {});
    await page.waitForTimeout(1500);
  }

  await assertNoText(page, /Service IA hors ligne/i, 'Copilote');
  await assertNoText(page, /ne répond pas/i, 'Copilote');

  // Ask a short question so the panel shows a real answer
  const suggestion = page.locator('.copilote-suggestion').first();
  if (await suggestion.count()) {
    await suggestion.click();
  } else {
    await page.getByPlaceholder(/Posez votre question/i).fill('Quels voyages sont en cours ?');
  }
  const send = page
    .locator('#app-copilote-panel')
    .getByRole('button', { name: /Envoyer|Send/i })
    .or(page.locator('#app-copilote-panel button[type="submit"]'))
    .first();
  if (await send.count()) {
    await send.click();
  } else {
    await page.keyboard.press('Enter');
  }

  // Wait for assistant bubble (not just user)
  await page
    .locator('.copilote-bulle--assistant, .copilote-ligne--assistant')
    .first()
    .waitFor({ state: 'visible', timeout: 60000 })
    .catch(async () => {
      // Fallback: any non-user message content after streaming
      await page.waitForTimeout(4000);
    });
  await page.waitForTimeout(1200);

  await assertNoText(page, /Service IA hors ligne/i, 'Copilote after ask');
  await shot(page, '11-copilote');
}

async function capturePlanificationIa(page) {
  await goto(page, '/voyages/nouveau');
  await page.waitForTimeout(500);

  const assiste = page.getByRole('button', { name: /Planification assistée/i });
  if (await assiste.count()) {
    await assiste.click();
    await page.waitForTimeout(300);
  }

  await page.getByRole('button', { name: /Proposer des voyages/i }).click();

  // Wait for propositions UI or a clear error
  const props = page.locator('[aria-label="Propositions de voyages"]');
  const err = page.locator('z-alert, [role="alert"]');

  try {
    await props.waitFor({ state: 'visible', timeout: 90000 });
  } catch {
    const errText = (await err.first().innerText().catch(() => '')) || '';
    throw new Error(
      `Planification IA: propositions not visible. Alert: ${errText.slice(0, 160) || '(none)'}`
    );
  }

  await page.waitForTimeout(800);
  // Prefer option cards in view
  await page.locator('text=Choisir cette proposition').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  await shot(page, '12-planification-ia');
}

async function main() {
  // Preflight health
  {
    const fe = await fetch(`${BASE}/`);
    if (!fe.ok) throw new Error(`frontend not reachable (${fe.status})`);
    console.log('frontend OK');

    const be = await fetch('http://localhost:8080/actuator/health');
    if (!be.ok) throw new Error(`backend not reachable (${be.status})`);
    console.log('backend OK');

    const ai = await fetch('http://localhost:8000/health');
    if (!ai.ok) throw new Error(`ai not reachable (${ai.status})`);
    const body = await ai.json();
    if (body.status !== 'UP') throw new Error(`AI health not UP: ${JSON.stringify(body)}`);
    console.log('AI health UP', body.modele || '');
  }

  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // 01 — connexion (signed out)
  await context.clearCookies();
  await goto(page, '/connexion');
  await page.evaluate(() => {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch {
      /* ignore */
    }
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await shot(page, '01-connexion');

  await signIn(page);

  // 02–03 shell + dashboard (full header width)
  await goto(page, '/');
  await waitDashboardReady(page);
  // Ensure Copilote header control is in viewport
  const copiloteBtn = page.getByRole('button', { name: /Copilote/i });
  await copiloteBtn.waitFor({ state: 'visible', timeout: 10000 });
  const box = await copiloteBtn.boundingBox();
  if (!box || box.x + box.width > VIEWPORT.width - 8) {
    throw new Error('Copilote button clipped — increase viewport width');
  }
  await shot(page, '02-app-shell');
  await shot(page, '03-tableau-de-bord');

  await navModule(page, 'Commandes');
  await waitNoListSkeleton(page);
  await shot(page, '04-liste-commandes');

  await navModule(page, 'Dossiers');
  await waitNoListSkeleton(page);
  await openFirstDetail(page, '/dossiers');
  await shot(page, '05-fiche-dossier');

  // 06 — nouveau voyage (assisted mode visible, before long AI run)
  await goto(page, '/voyages/nouveau');
  await page.getByRole('button', { name: /Planification assistée/i }).click().catch(() => {});
  await page.waitForTimeout(400);
  await shot(page, '06-nouveau-voyage');

  await navModule(page, 'Voyages');
  await waitNoListSkeleton(page);
  // Ensure not stuck on skeleton grid
  const voyageSk = await page.locator('app-list-table-skeleton').count();
  if (voyageSk > 0) {
    throw new Error('Voyages list still showing skeleton');
  }
  await shot(page, '07-liste-voyages');

  await navModule(page, 'Véhicules');
  await waitNoListSkeleton(page);
  await openFirstDetail(page, '/vehicules');
  await shot(page, '08-fiche-vehicule');

  await navModule(page, 'Carburant');
  await waitNoListSkeleton(page);
  await shot(page, '09-carburant');

  await navModule(page, 'Maintenance');
  await waitNoListSkeleton(page);
  await shot(page, '10-maintenance');

  // 11 — copilote online + answer
  await captureCopilote(page);

  // 12 — AI voyage propositions
  await capturePlanificationIa(page);

  await browser.close();
  console.log('Done →', OUT);
}

main().catch((err) => {
  console.error('\nFAILED:', err.message || err);
  process.exit(1);
});
