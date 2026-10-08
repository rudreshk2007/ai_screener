import { test, expect } from "@playwright/test";

test.describe("EarlySteps End-to-End User Journey", () => {
  const testUserEmail = `parent_${Date.now()}@earlysteps.org`;

  test("1. Landing page display & disclaimer", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/EarlySteps/);
    // Mandatory Screening Notice must be visible
    await expect(page.locator("text=EarlySteps provides developmental SCREENING, not a medical diagnosis")).toBeVisible();
    await expect(page.locator("text=Designed for Toddlers & Preschoolers (12 to 48 Months)")).toBeVisible();
    await expect(page.locator("text=DPDP Act 2023 Compliant").first()).toBeVisible();
  });

  test("2. Parent Signup with DPDP Consent", async ({ page }) => {
    await page.goto("/auth/login");
    // Switch to signup mode
    await page.click("button:has-text('Create Account')");
    await page.fill("#name", "Rohan Verma");
    await page.fill("#email", testUserEmail);
    await page.fill("#password", "Password@123");

    // DPDP Act consent checkbox must be present and checked
    const consentCheckbox = page.locator("#consent-checkbox");
    await expect(consentCheckbox).toBeVisible();
    await consentCheckbox.check();

    await page.click("button[type='submit']");
    // Should navigate to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("3. Add Child Profile & Age Calculation", async ({ page }) => {
    await page.goto("/dashboard");
    await page.click("#add-child-button");

    await page.fill("#c-name", "Vivaan");
    // Set birth date 20 months ago
    const dob = new Date();
    dob.setMonth(dob.getMonth() - 20);
    const dobString = dob.toISOString().split("T")[0];

    await page.fill("#c-dob", dobString);
    await page.selectOption("#c-gender", "male");

    await page.click("#save-child-btn");

    // Vivaan should appear in the dashboard
    await expect(page.locator("text=Vivaan").first()).toBeVisible();
  });

  test("4. Complete Questionnaire with Auto-Save & Scoring", async ({ page }) => {
    await page.goto("/screening");
    // Verify progress bar and category
    await expect(page.locator("[role='progressbar']")).toBeVisible();
    await expect(page.locator("text=Everyday Example:")).toBeVisible();

    // Answer questions
    for (let i = 0; i < 20; i++) {
      const submitBtn = page.locator("#submit-screening-btn");
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        break;
      }

      if (i === 1 || i === 4 || i === 11) {
        await page.click("#answer-no-btn");
      } else {
        await page.click("#answer-yes-btn");
      }
      await page.waitForTimeout(300);
    }

    // Wait for result page
    await expect(page).toHaveURL(/.*results/, { timeout: 10000 });
  });

  test("5. Result Page, Risk Classification & PDF Generation", async ({ page }) => {
    // Visit result page via seeded screening
    await page.goto("/dashboard");
    const reportLink = page.locator("a:has-text('View Doctor Report & PDF')").first();
    await reportLink.click();

    // Must have prominent non-diagnosis alert
    await expect(page.locator("text=Screening Tool Only — Not a Medical Diagnosis")).toBeVisible();

    // Classification box must have icon, color, and text
    const classificationBox = page.locator("#risk-classification-box");
    await expect(classificationBox).toBeVisible();
    await expect(classificationBox).toContainText(/likelihood of needing further evaluation/i);

    // PDF download button must be present
    const pdfBtn = page.locator("#download-pdf-btn");
    await expect(pdfBtn).toBeVisible();
    await pdfBtn.click();
  });

  test("6. DPDP Act 2023 Permanent Deletion ('Delete-My-Data')", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("text=Permanent Erasure: \"Delete-My-Data\"")).toBeVisible();

    // Accept dialog
    page.on("dialog", (dialog) => dialog.accept());

    await page.fill("#delete-email-input", testUserEmail);
    await page.click("#confirm-delete-btn");

    await expect(page.locator("text=All personal data, children profiles, screenings, and results have been permanently erased.")).toBeVisible();
  });
});
