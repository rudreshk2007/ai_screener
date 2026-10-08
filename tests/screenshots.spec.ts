import { test } from "@playwright/test";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "375px", width: 375, height: 812 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1440px", width: 1440, height: 900 },
];

test.describe("Visual Regression & Responsive Screenshots", () => {
  test.beforeAll(async () => {
    const dir = path.join(process.cwd(), "screenshots");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const pagesToCapture = [
    { name: "landing", path: "/" },
    { name: "login", path: "/auth/login" },
    { name: "dashboard", path: "/dashboard" },
    { name: "screening", path: "/screening" },
    { name: "milestones", path: "/milestones" },
    { name: "specialists", path: "/specialists" },
    { name: "clinician", path: "/clinician" },
    { name: "admin", path: "/admin" },
    { name: "privacy", path: "/privacy" },
  ];

  for (const pageInfo of pagesToCapture) {
    for (const vp of VIEWPORTS) {
      test(`Screenshot: ${pageInfo.name} at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(pageInfo.path, { waitUntil: "networkidle" });
        await page.waitForTimeout(500); // ensure fonts & hydration finish
        await page.screenshot({
          path: `screenshots/${pageInfo.name}-${vp.name}.png`,
          fullPage: true,
        });
      });
    }

    // Also capture Dark Mode at 1440px
    test(`Screenshot: ${pageInfo.name} Dark Mode`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(pageInfo.path, { waitUntil: "networkidle" });
      // Enable dark mode class on html element
      await page.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `screenshots/${pageInfo.name}-dark.png`,
        fullPage: true,
      });
    });
  }

  // Also capture Result Page specifically using the seeded screening ID
  test("Screenshot: result page at all sizes & dark mode", async ({ page, request }) => {
    // Get seeded screening
    const res = await request.get("http://localhost:3000/api/clinician/screenings");
    const json = await res.json();
    const screeningId = json.screenings?.[0]?.id || "seed-demo";

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`/results/${screeningId}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `screenshots/result-${vp.name}.png`,
        fullPage: true,
      });
    }

    // Result in Dark Mode
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/results/${screeningId}`, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `screenshots/result-dark.png`,
      fullPage: true,
    });
  });
});
