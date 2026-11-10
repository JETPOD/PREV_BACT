#!/usr/bin/env node
/*
 * Bactério Challenge : ajout des objectifs Plausible listés dans GOALS.txt.
 *
 * Deux modes :
 *  1. Navigateur (toutes offres Plausible, par défaut) : une fenêtre Chrome s'ouvre,
 *     vous vous connectez vous-même, le script remplit ensuite le formulaire
 *     Settings → Goals → Add goal → Custom event pour chaque objectif manquant.
 *     Aucun mot de passe n'est lu ni stocké par le script ; la session est gardée
 *     dans le dossier local .plausible-session (à supprimer après usage si besoin).
 *  2. API (offre Enterprise uniquement) : si la variable PLAUSIBLE_SITES_API_KEY
 *     est définie, le script utilise PUT /api/v1/sites/goals (idempotent).
 *
 * Options :
 *   --dry-run        affiche les objectifs sans rien créer
 *   --limit N        ne crée que les N premiers objectifs manquants (essai)
 *   --site DOMAINE   site Plausible (défaut : jetpod.github.io)
 *   --host URL       instance Plausible (défaut : https://plausible.io)
 *   --goals FICHIER  liste des objectifs (défaut : ../../GOALS.txt)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const DRY = args.includes("--dry-run");
const LIMIT = Number(opt("--limit", "0")) || Infinity;
const SITE = opt("--site", "jetpod.github.io");
const HOST = opt("--host", "https://plausible.io").replace(/\/$/, "");
const GOALS_FILE = path.resolve(here, opt("--goals", "../../GOALS.txt"));

const goals = fs.readFileSync(GOALS_FILE, "utf8").split(/\r?\n/).map(s => s.trim()).filter(Boolean);
if (new Set(goals).size !== goals.length) throw new Error("Doublons dans " + GOALS_FILE);
console.log(`${goals.length} objectifs lus dans ${path.relative(process.cwd(), GOALS_FILE)} · site ${SITE}`);

if (DRY) { goals.forEach((g, i) => console.log(String(i + 1).padStart(2), g)); process.exit(0); }

// ---------------------------------------------------------------- Mode API
if (process.env.PLAUSIBLE_SITES_API_KEY) {
  const key = process.env.PLAUSIBLE_SITES_API_KEY;
  let ok = 0;
  for (const name of goals.slice(0, LIMIT)) {
    const res = await fetch(`${HOST}/api/v1/sites/goals`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ site_id: SITE, goal_type: "event", event_name: name })
    });
    if (res.ok) { ok++; console.log("✓", name); }
    else { console.error("✗", name, res.status, await res.text()); if (res.status === 401 || res.status === 402) break; }
  }
  console.log(`${ok} objectifs créés ou déjà présents.`);
  process.exit(ok === Math.min(goals.length, LIMIT) ? 0 : 1);
}

// ---------------------------------------------------------- Mode navigateur
const { chromium } = await import("playwright");
const SETTINGS = `${HOST}/${encodeURIComponent(SITE)}/settings/goals`;
const shots = path.join(here, "captures");
const ctx = await chromium.launchPersistentContext(path.join(here, ".plausible-session"), {
  headless: process.env.HEADLESS === "1", viewport: { width: 1280, height: 900 }, locale: "en-US"
});
const page = ctx.pages()[0] || await ctx.newPage();
page.setDefaultTimeout(15000);

const addTrigger = () => page.locator("#add-goal-dropdown-trigger:visible, #add-goal-dropdown-empty-trigger:visible").first();

async function openSettings() {
  await page.goto(SETTINGS);
  if (!(await addTrigger().isVisible().catch(() => false))) {
    console.log("\n→ Connectez-vous à Plausible dans la fenêtre ouverte (5 minutes maximum).");
    console.log("  Le script reprend tout seul dès que la page des objectifs s'affiche.\n");
    const deadline = Date.now() + 5 * 60 * 1000;
    while (Date.now() < deadline) {
      if (!page.url().includes("/settings/goals") && !/login|register|2fa|verify/.test(page.url())) {
        await page.goto(SETTINGS).catch(() => {});
      }
      if (await addTrigger().isVisible().catch(() => false)) break;
      await page.waitForTimeout(2000);
    }
  }
  await addTrigger().waitFor({ state: "visible", timeout: 10000 });
}

async function existingGoals() {
  await page.waitForTimeout(800);
  const table = page.locator("table");
  if (!(await table.count())) return new Set();
  const text = await table.first().innerText();
  return new Set(text.split(/[\n\t]/).map(s => s.trim()).filter(Boolean));
}

async function addGoal(name) {
  await page.keyboard.press("Escape").catch(() => {});
  await addTrigger().click();
  await page.locator('[phx-value-goal-type="custom_events"]:visible').first().click();

  // Fenêtre « événements détectés » : on choisit l'ajout manuel.
  const manual = page.locator('[phx-click="add-manually"]:visible');
  const input = page.locator('#custom-events-form input[type="text"][id^="event_name_input_"]:visible').first();
  await Promise.race([input.waitFor({ state: "visible" }), manual.first().waitFor({ state: "visible" })]);
  if (await manual.count()) await manual.first().click();
  await input.waitFor({ state: "visible" });

  await input.click();
  await input.fill("");
  await input.pressSequentially(name, { delay: 15 });

  // Option « Create "nom" » ou suggestion exacte si l'événement a déjà été reçu.
  const listbox = page.locator(`ul:visible`).filter({ has: page.locator("a[data-display-value]") });
  const option = listbox.locator("a[data-display-value]").filter({
    has: page.locator(`xpath=self::*[@data-display-value=${xpathLiteral(name)}]`)
  }).first();
  await option.waitFor({ state: "visible", timeout: 10000 });
  await option.click();

  const hidden = page.locator('#custom-events-form input[type="hidden"][name="goal[event_name]"]').first();
  await page.waitForFunction(
    ([el, v]) => el && el.value === v,
    [await hidden.elementHandle(), name],
    { timeout: 8000 }
  );

  const form = page.locator("form").filter({ has: page.locator("#custom-events-form") }).first();
  await form.locator('button[type="submit"]').click();

  // Succès : le formulaire se ferme. Échec : message d'erreur dans le formulaire.
  const closed = await page.locator("#custom-events-form").first()
    .waitFor({ state: "hidden", timeout: 10000 }).then(() => true).catch(() => false);
  if (!closed) {
    const err = (await form.innerText().catch(() => "")).split("\n").find(l => /taken|exist|invalid|limit|error/i.test(l));
    throw new Error(err || "le formulaire ne s'est pas fermé");
  }
}

function xpathLiteral(s) {
  if (!s.includes("'")) return `'${s}'`;
  if (!s.includes('"')) return `"${s}"`;
  return "concat('" + s.split("'").join(`', "'", '`) + "')";
}

let created = 0, skipped = 0, failed = [];
try {
  await openSettings();
  const before = await existingGoals();
  const todo = goals.filter(g => !before.has(g));
  skipped = goals.length - todo.length;
  console.log(`${skipped} déjà présents · ${todo.length} à créer${LIMIT < Infinity ? ` (limite ${LIMIT})` : ""}`);

  for (const name of todo.slice(0, LIMIT)) {
    try {
      await addGoal(name);
      created++;
      console.log(`✓ ${String(created).padStart(2)} ${name}`);
    } catch (e) {
      failed.push(name);
      fs.mkdirSync(shots, { recursive: true });
      const file = path.join(shots, `echec-${failed.length}.png`);
      await page.screenshot({ path: file, fullPage: true }).catch(() => {});
      console.error(`✗ ${name} : ${e.message.split("\n")[0]} (capture : ${path.relative(process.cwd(), file)})`);
      await openSettings();
      if (failed.length >= 3 && created === 0) { console.error("Trois échecs d'affilée, arrêt."); break; }
    }
  }

  // Contrôle final sur la page rechargée.
  await openSettings();
  const after = await existingGoals();
  const missing = goals.filter(g => !after.has(g));
  console.log(`\nBilan : ${created} créés · ${skipped} déjà présents · ${failed.length} échecs`);
  console.log(missing.length ? `Encore absents (${missing.length}) :\n  ${missing.join("\n  ")}` : `Les ${goals.length} objectifs sont présents dans Plausible.`);
  process.exitCode = missing.length && LIMIT === Infinity ? 1 : 0;
} finally {
  await ctx.close();
}
