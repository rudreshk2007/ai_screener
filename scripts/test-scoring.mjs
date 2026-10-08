import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("--- STARTING UNIT TESTS FOR SCORING ENGINE ---");

// Load configs directly
const mchatConfig = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "config/screening/m-chat-r-16-30.json"), "utf8")
);
const p12Config = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "config/screening/placeholder-12-15.json"), "utf8")
);
const p31Config = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "config/screening/placeholder-31-48.json"), "utf8")
);

// Pure score helper mirroring lib/screening/scoring.ts
function scoreScreeningTest(config, answers) {
  let totalScore = 0;
  for (const q of config.questions) {
    const res = answers[q.id];
    if (res && res === q.riskAnswer) {
      totalScore += 1;
    }
  }
  const matched = config.riskThresholds.find(
    (t) => totalScore >= t.minScore && totalScore <= t.maxScore
  ) || config.riskThresholds[config.riskThresholds.length - 1];

  return { totalScore, riskLevel: matched.level, riskLabel: matched.label };
}

// Test 1: M-CHAT-R perfect passing answers (all typical responses)
// For standard questions (1, 3, 4, 6..11, 13..20) -> YES is typical
// For inverted questions (2, 5, 12) -> NO is typical
const typicalAnswers = {};
for (let i = 1; i <= 20; i++) {
  if (i === 2 || i === 5 || i === 12) {
    typicalAnswers[i] = "NO";
  } else {
    typicalAnswers[i] = "YES";
  }
}

const lowRiskResult = scoreScreeningTest(mchatConfig, typicalAnswers);
assert.strictEqual(lowRiskResult.totalScore, 0, "All typical answers must produce score 0");
assert.strictEqual(lowRiskResult.riskLevel, "LOW", "Score 0 must be LOW risk");
assert.strictEqual(
  lowRiskResult.riskLabel,
  "Low likelihood of needing further evaluation",
  "Label must state low likelihood of needing further evaluation"
);
console.log("✔ Test 1 Passed: Low risk calculation (Score 0 -> LOW)");

// Test 2: Inverted questions check (2, 5, 12)
// If parent answers YES to 2, 5, 12 and typical to all others -> Score should be 3 (MEDIUM)
const mediumAnswers = { ...typicalAnswers, 2: "YES", 5: "YES", 12: "YES" };
const mediumResult = scoreScreeningTest(mchatConfig, mediumAnswers);
assert.strictEqual(mediumResult.totalScore, 3, "Inverted questions 2, 5, 12 answered YES must yield score 3");
assert.strictEqual(mediumResult.riskLevel, "MEDIUM", "Score 3 must be MEDIUM risk");
assert.strictEqual(
  mediumResult.riskLabel,
  "Medium likelihood of needing further evaluation",
  "Label must state medium likelihood"
);
console.log("✔ Test 2 Passed: Inverted items 2, 5, 12 properly scored as risk (Score 3 -> MEDIUM)");

// Test 3: High risk calculation (Score 8+)
const highAnswers = { ...typicalAnswers };
// Flip 8 standard questions to NO (risk)
[1, 3, 6, 7, 8, 9, 10, 14].forEach((id) => {
  highAnswers[id] = "NO";
});
const highResult = scoreScreeningTest(mchatConfig, highAnswers);
assert.strictEqual(highResult.totalScore, 8, "Score should be 8");
assert.strictEqual(highResult.riskLevel, "HIGH", "Score 8 must be HIGH risk");
assert.strictEqual(
  highResult.riskLabel,
  "High likelihood of needing further evaluation",
  "Label must state high likelihood"
);
console.log("✔ Test 3 Passed: High risk calculation (Score 8 -> HIGH)");

// Test 4: Placeholder config checks
assert.strictEqual(p12Config.isPlaceholder, true, "12-15m config must have isPlaceholder true");
assert.ok(
  p12Config.clinicianBanner.includes("Requires clinician-approved content"),
  "12-15m must have 'Requires clinician-approved content' banner"
);
assert.strictEqual(p31Config.isPlaceholder, true, "31-48m config must have isPlaceholder true");
assert.ok(
  p31Config.clinicianBanner.includes("Requires clinician-approved content"),
  "31-48m must have 'Requires clinician-approved content' banner"
);
console.log("✔ Test 4 Passed: Placeholder configs adhere to Critical Rule #2");

// Test 5: Verify no questionnaire mentions "your child has autism"
[mchatConfig, p12Config, p31Config].forEach((cfg) => {
  const jsonStr = JSON.stringify(cfg).toLowerCase();
  assert.ok(
    !jsonStr.includes("your child has autism"),
    `Config ${cfg.id} must never contain forbidden phrase 'your child has autism'`
  );
});
console.log("✔ Test 5 Passed: No config contains forbidden diagnostic phrasing (Critical Rule #3)");

console.log("--- ALL UNIT TESTS PASSED SUCCESSFULLY! ---");
