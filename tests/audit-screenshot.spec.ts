import { test } from "@playwright/test";
import fs from "fs";
import path from "path";

test.describe("Step 0: Audit Current Landing Page", () => {
  const auditDir = path.join(process.cwd(), "screenshots", "audit");

  test.beforeAll(() => {
    if (!fs.existsSync(auditDir)) {
      fs.mkdirSync(auditDir, { recursive: true });
    }
  });

  const viewports = [
    { name: "375", width: 375, height: 812 },
    { name: "768", width: 768, height: 1024 },
    { name: "1440", width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test(`Capture landing at ${vp.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      // Let any hydration complete
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(auditDir, `landing-${vp.name}.png`),
        fullPage: true,
      });
    });
  }
});
