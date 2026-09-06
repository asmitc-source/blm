import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const out = "/tmp/blm-docs";
mkdirSync(out, { recursive: true });

const hide = `
  [data-builder], [class*="app-builder"] { display: none !important; visibility: hidden !important; }
`;

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  localStorage.setItem("blm-theme", "light");
});
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await page.addStyleTag({ content: hide });
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/hero.png`, fullPage: false });

await page.evaluate(() => {
  localStorage.setItem("blm-theme", "dark");
  document.documentElement.classList.add("dark");
});
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}/hero-dark.png`, fullPage: false });

await page.evaluate(() => {
  document.documentElement.classList.remove("dark");
  localStorage.setItem("blm-theme", "light");
});
await page.goto("http://127.0.0.1:8080/product", { waitUntil: "networkidle", timeout: 60000 });
await page.addStyleTag({ content: hide });
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/product.png`, fullPage: false });

await page.goto("http://127.0.0.1:8080/pricing", { waitUntil: "networkidle", timeout: 60000 });
await page.addStyleTag({ content: hide });
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}/pricing.png`, fullPage: false });

await page.goto("http://127.0.0.1:8080/how-it-works", { waitUntil: "networkidle", timeout: 60000 });
await page.addStyleTag({ content: hide });
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}/how-it-works.png`, fullPage: false });

await browser.close();
console.log("ok", out);
