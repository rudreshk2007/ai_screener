import { test } from "@playwright/test";
import fs from "fs";
import path from "path";

test.describe("Step 9: After Screenshots Verification", () => {
  const afterDir = path.join(process.cwd(), "screenshots", "after");

  test.beforeAll(() => {
    if (!fs.existsSync(afterDir)) {
      fs.mkdirSync(afterDir, { recursive: true });
    }
  });

  const viewports = [
    { name: "375", width: 375, height: 812 },
    { name: "768", width: 768, height: 1024 },
    { name: "1440", width: 1440, height: 900 },
  ];

  const themes = ["light", "dark"] as const;

  for (const vp of viewports) {
    for (const theme of themes) {
      // 1. Landing Page
      test(`Landing - ${vp.name}px - ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/");
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        } else {
          await page.evaluate(() => document.documentElement.classList.remove("dark"));
        }
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(afterDir, `landing-${vp.name}-${theme}.png`),
          fullPage: true,
        });
      });

      // 2. Signup Page
      test(`Signup - ${vp.name}px - ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/auth/login");
        await page.click("button:has-text('Create Account')");
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        }
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(afterDir, `signup-${vp.name}-${theme}.png`),
          fullPage: true,
        });
      });

      // 3. Consent Screen
      test(`Consent - ${vp.name}px - ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/auth/login");
        await page.click("button:has-text('Create Account')");
        await page.locator("#consent-checkbox").scrollIntoViewIfNeeded();
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        }
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(afterDir, `consent-${vp.name}-${theme}.png`),
        });
      });

      // 4. Dashboard Page
      test(`Dashboard - ${vp.name}px - ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/dashboard");
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        }
        await page.waitForTimeout(400);
        await page.screenshot({
          path: path.join(afterDir, `dashboard-${vp.name}-${theme}.png`),
          fullPage: true,
        });
      });

      // 5. Add Child Modal
      test(`Add Child - ${vp.name}px - ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/dashboard");
        await page.click("#add-child-button");
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        }
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(afterDir, `add-child-${vp.name}-${theme}.png`),
        });
      });

      // 6. Questionnaire Screen
      test(`Questionnaire - ${vp.name}px - ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/screening");
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        }
        await page.waitForTimeout(400);
        await page.screenshot({
          path: path.join(afterDir, `questionnaire-${vp.name}-${theme}.png`),
          fullPage: true,
        });
      });

      // 7. Result Page
      test(`Result - ${vp.name}px - ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/results/scr_muzmgmie_dc8w8l");
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        }
        await page.waitForTimeout(400);
        await page.screenshot({
          path: path.join(afterDir, `result-${vp.name}-${theme}.png`),
          fullPage: true,
        });
      });

      // 8. Milestones Guide
      test(`Milestones - ${vp.name}px - ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/milestones");
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        }
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(afterDir, `milestones-${vp.name}-${theme}.png`),
          fullPage: true,
        });
      });

      // 9. Specialists Directory
      test(`Specialists - ${vp.name}px - ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/specialists");
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        }
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(afterDir, `specialists-${vp.name}-${theme}.png`),
          fullPage: true,
        });
      });

      // 10. FAQ Section
      test(`FAQ - ${vp.name}px - ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/#faq");
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        }
        // Open first two FAQ items to show open state
        await page.evaluate(() => {
          const details = document.querySelectorAll("details");
          if (details[0]) details[0].open = true;
          if (details[1]) details[1].open = true;
        });
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(afterDir, `faq-${vp.name}-${theme}.png`),
        });
      });
    }
  }
});
