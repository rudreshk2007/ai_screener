import { getQuestionnaireConfig, QuestionnaireConfig, RiskThreshold } from "./config-loader";

export interface ScoreDetail {
  questionId: number;
  questionText: string;
  category: string;
  response: "YES" | "NO";
  isRiskIndicator: boolean;
  scoreContribution: number;
}

export interface ScreeningScoreResult {
  questionnaireId: string;
  questionnaireName: string;
  totalScore: number;
  maxPossibleScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskLabel: string;
  riskBadge: string;
  riskColor: "emerald" | "amber" | "rose";
  summary: string;
  recommendedActions: string[];
  citation: QuestionnaireConfig["citation"];
  isPlaceholder?: boolean;
  clinicianBanner?: string;
  answeredCount: number;
  totalQuestions: number;
  details: ScoreDetail[];
}

/**
 * Pure scoring function that evaluates user responses against the given questionnaire configuration.
 * Strictly reads questions and thresholds from the config.
 */
export function scoreScreening(
  questionnaireId: string,
  answers: Record<number, "YES" | "NO">
): ScreeningScoreResult {
  const config = getQuestionnaireConfig(questionnaireId);
  const questions = config.questions;

  let totalScore = 0;
  const details: ScoreDetail[] = [];
  let answeredCount = 0;

  for (const q of questions) {
    const response = answers[q.id];
    if (response) {
      answeredCount++;
      const isRiskIndicator = response === q.riskAnswer;
      const scoreContribution = isRiskIndicator ? 1 : 0;
      totalScore += scoreContribution;

      details.push({
        questionId: q.id,
        questionText: q.text,
        category: q.category,
        response,
        isRiskIndicator,
        scoreContribution,
      });
    }
  }

  // Find matching threshold from config
  const matchedThreshold: RiskThreshold = config.riskThresholds.find(
    (th) => totalScore >= th.minScore && totalScore <= th.maxScore
  ) || config.riskThresholds[config.riskThresholds.length - 1]; // fallback to highest if exceeding

  return {
    questionnaireId: config.id,
    questionnaireName: config.name,
    totalScore,
    maxPossibleScore: questions.length,
    riskLevel: matchedThreshold.level,
    riskLabel: matchedThreshold.label,
    riskBadge: matchedThreshold.badge,
    riskColor: matchedThreshold.color,
    summary: matchedThreshold.summary,
    recommendedActions: matchedThreshold.recommendedActions,
    citation: config.citation,
    isPlaceholder: config.isPlaceholder,
    clinicianBanner: config.clinicianBanner,
    answeredCount,
    totalQuestions: questions.length,
    details,
  };
}
