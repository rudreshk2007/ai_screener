import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("WCAG 2.2 AA Accessibility Audits", () => {
  const auditRoutes = [
    { name: "Landing", url: "/" },
    { name: "Login & Consent", url: "/auth/login" },
    { name: "Dashboard", url: "/dashboard" },
    { name: "Screening Question", url: "/screening" },
    { name: "Milestones Guide", url: "/milestones" },
    { name: "Specialists Directory", url: "/specialists" },
    { name: "Clinician Queue", url: "/clinician" },
    { name: "Privacy Center", url: "/privacy" },
  ];

  for (const route of auditRoutes) {
    test(`A11y Audit: ${route.name}`, async ({ page }) => {
      await page.goto(route.url, { waitUntil: "networkidle" });
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      // Log violations if any
      if (accessibilityScanResults.violations.length > 0) {
        console.warn(
          `[a11y warning] ${route.name} had ${accessibilityScanResults.violations.length} violations:`,
          accessibilityScanResults.violations.map((v) => ({ id: v.id, impact: v.impact, description: v.description }))
        );
      }

      // Assert no critical violations
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical"
      );
      expect(criticalViolations.length).toBe(0);
    });
  }
});
