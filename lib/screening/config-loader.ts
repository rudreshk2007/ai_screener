import fs from "fs";
import path from "path";

export interface QuestionnaireQuestion {
  id: number;
  text: string;
  exampleText: string;
  riskAnswer: "YES" | "NO";
  category: string;
  videoPlaceholder?: string;
}

export interface RiskThreshold {
  level: "LOW" | "MEDIUM" | "HIGH";
  label: string;
  minScore: number;
  maxScore: number;
  color: "emerald" | "amber" | "rose";
  badge: string;
  summary: string;
  recommendedActions: string[];
}

export interface QuestionnaireConfig {
  id: string;
  name: string;
  shortName: string;
  version: string;
  isPlaceholder?: boolean;
  clinicianBanner?: string;
  targetAgeBand: {
    minMonths: number;
    maxMonths: number;
    label: string;
  };
  citation: {
    title: string;
    authors: string;
    journal: string;
    copyrightNotice: string;
    clinicalDisclaimer: string;
  };
  riskThresholds: RiskThreshold[];
  questions: QuestionnaireQuestion[];
}

// In-memory cache for fast access
const configsCache = new Map<string, QuestionnaireConfig>();

export function getQuestionnaireConfig(questionnaireId: string): QuestionnaireConfig {
  if (configsCache.has(questionnaireId)) {
    return configsCache.get(questionnaireId)!;
  }

  const configDir = path.join(process.cwd(), "config", "screening");
  const filePath = path.join(configDir, `${questionnaireId}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Screening configuration for ID "${questionnaireId}" not found at ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const config = JSON.parse(raw) as QuestionnaireConfig;
  configsCache.set(questionnaireId, config);
  return config;
}

export function getAllQuestionnaireConfigs(): QuestionnaireConfig[] {
  const configDir = path.join(process.cwd(), "config", "screening");
  if (!fs.existsSync(configDir)) return [];

  const files = fs.readdirSync(configDir).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const id = file.replace(/\.json$/, "");
    return getQuestionnaireConfig(id);
  });
}

export function getQuestionnaireForAge(ageInMonths: number): QuestionnaireConfig {
  if (ageInMonths >= 16 && ageInMonths <= 30) {
    return getQuestionnaireConfig("m-chat-r-16-30");
  } else if (ageInMonths < 16) {
    return getQuestionnaireConfig("placeholder-12-15");
  } else {
    return getQuestionnaireConfig("placeholder-31-48");
  }
}
