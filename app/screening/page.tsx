"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  Baby,
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  AlertTriangle,
  HelpCircle,
  Video,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Home,
  CheckCircle2,
} from "lucide-react";

function ScreeningFlow() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const childIdParam = searchParams.get("childId");

  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>(childIdParam || "");
  const [loading, setLoading] = useState(true);
  const [screeningId, setScreeningId] = useState<string | null>(null);
  const [config, setConfig] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "YES" | "NO">>({});
  const [autoSaved, setAutoSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [sensoryCalmMode, setSensoryCalmMode] = useState(false);

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Fetch available children
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/children");
        const data = await res.json();
        if (data.children && data.children.length > 0) {
          setChildren(data.children);
          if (!selectedChildId) {
            setSelectedChildId(data.children[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Start screening session when child is selected
  const startScreeningForChild = async (childId: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/screening/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId }),
      });
      const data = await res.json();
      if (res.ok) {
        setScreeningId(data.screeningId);
        setConfig(data.config);
        setCurrentIndex(0);
        setAnswers({});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChildId) {
      startScreeningForChild(selectedChildId);
    }
  }, [selectedChildId]);

  // Handle answering Yes or No
  const handleAnswer = useCallback(
    async (response: "YES" | "NO") => {
      if (!config || !screeningId) return;

      const currentQuestion = config.questions[currentIndex];
      const newAnswers = { ...answers, [currentQuestion.id]: response };
      setAnswers(newAnswers);

      // Auto-save via API
      setAutoSaved(false);
      try {
        await fetch("/api/screening/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            screeningId,
            questionId: currentQuestion.id,
            response,
          }),
        });
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      } catch (err) {
        console.error(err);
      }

      // Auto-advance if not last question
      if (currentIndex < config.questions.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, 220);
      }
    },
    [config, screeningId, currentIndex, answers]
  );

  // Keyboard shortcut listener (Y, N, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === "y" || e.key === "Y") {
        e.preventDefault();
        handleAnswer("YES");
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        handleAnswer("NO");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (config && currentIndex < config.questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAnswer, config, currentIndex]);

  // Save and Exit flow
  const handleSaveAndExit = () => {
    showToast("Progress saved securely. You can resume anytime from your dashboard.");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  // Submit screening
  const handleSubmit = async () => {
    if (!screeningId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/screening/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screeningId,
          answers,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/results/${screeningId}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-base text-foreground font-bold">Preparing Standardized Questionnaire</p>
          <p className="text-sm text-foreground-muted">Loading age-appropriate surveillance protocol...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-primary-soft text-primary mx-auto flex items-center justify-center shadow-subtle">
          <Baby className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Select a Child to Begin</h2>
        <p className="text-sm text-foreground-muted leading-relaxed">
          Please add or select a child profile to calibrate the age-appropriate standardized instrument.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-subtle inline-block"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const currentQuestion = config.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / config.questions.length) * 100);
  const currentAnswer = answers[currentQuestion.id];
  const totalAnsweredCount = Object.keys(answers).length;

  return (
    <div
      className={`max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6 transition-colors duration-200 ${
        sensoryCalmMode ? "filter contrast-95" : ""
      }`}
    >
      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-hover flex items-center gap-3 border border-slate-700 animate-fade-in text-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clinician-Approved Banner if placeholder band */}
      {config.isPlaceholder && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-1 shadow-subtle">
          <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Requires Clinician-Approved Content</span>
          </div>
          <p className="text-sm leading-relaxed">{config.clinicianBanner}</p>
        </div>
      )}

      {/* Top Header Bar: Child Profile + Save-and-Exit + Sensory Calm */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center font-bold">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              aria-label="Select child profile for screening"
              className="text-sm font-bold bg-muted border border-border rounded-lg px-3 py-1.5 min-h-[40px] text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({Math.floor((new Date().getTime() - new Date(c.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30.4375))}m)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls: Sensory Mode + Save & Exit */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSensoryCalmMode(!sensoryCalmMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all min-h-[40px] ${
              sensoryCalmMode
                ? "bg-slate-800 text-white border-slate-700"
                : "bg-muted text-foreground-muted hover:text-foreground border-border"
            }`}
            title="Calm sensory-friendly mode"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>{sensoryCalmMode ? "Sensory Calm: On" : "Calm Mode"}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndExit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-sm font-semibold text-foreground min-h-[40px] transition-colors"
          >
            <Save className="w-4 h-4 text-foreground-muted" />
            <span>Save &amp; Exit</span>
          </button>
        </div>
      </div>

      {/* Large Progress Indicator ("Question 4 of 20", base 18px+ font) */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
              Question {currentIndex + 1} of {config.questions.length}
            </h2>
            <p className="text-sm text-foreground-muted">
              {totalAnsweredCount} of {config.questions.length} observations recorded
            </p>
          </div>
          <span className="text-sm font-bold text-primary px-3 py-1 bg-primary-soft rounded-full">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Accessible Progress Bar */}
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-label="Screening completion progress"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Question Step Chips (1..20 Quick Jump) */}
        <div className="pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {config.questions.map((q: any, idx: number) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Jump to question ${idx + 1}`}
                className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center justify-center ${
                  isCurrent
                    ? "bg-primary text-white ring-2 ring-primary/30 scale-105"
                    : isAnswered
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300"
                    : "bg-muted text-foreground-muted hover:bg-border"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Single-Question Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-10 border border-border shadow-card space-y-6">
        {/* Category Domain & Video Hint */}
        <div className="flex items-center justify-between">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-primary-soft text-primary border border-primary/20">
            Observation Focus: {currentQuestion.category}
          </span>

          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground-muted hover:text-primary p-1 min-h-[44px]"
            title="Video guide placeholder"
            aria-label="View video guide placeholder"
          >
            <Video className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Watch Video Example</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground leading-snug">
            {currentQuestion.text}
          </h1>

          {/* Everyday Concrete Parent Example */}
          <div className="p-5 rounded-2xl bg-muted border border-border/80 space-y-1.5">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              Everyday Example:
            </span>
            <p className="text-base text-foreground leading-relaxed">
              {currentQuestion.exampleText}
            </p>
          </div>

          {/* "Why We Ask This" Expandable Hint */}
          <details className="group rounded-2xl bg-background border border-border p-4">
            <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold text-foreground-muted hover:text-foreground">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>Why pediatricians ask this question</span>
              </span>
              <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
            </summary>
            <p className="pt-3 text-sm text-foreground-muted leading-relaxed border-t border-border mt-3">
              Observations in the <strong>{currentQuestion.category}</strong> domain help clinicians understand your toddler's joint attention, non-verbal communication, and social interest during everyday family interactions.
            </p>
          </details>
        </div>

        {/* Big Tap Target Answer Buttons (>= 56px height, visible focus) */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            onClick={() => handleAnswer("YES")}
            className={`py-5 px-6 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-3 min-h-[56px] border-2 shadow-subtle ${
              currentAnswer === "YES"
                ? "bg-primary text-white border-primary ring-4 ring-primary/20 scale-[1.01]"
                : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
            }`}
            id="answer-yes-btn"
          >
            <Check className="w-5 h-5 text-emerald-400" />
            <span>Yes</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-xs font-mono font-medium opacity-60 bg-black/10 dark:bg-white/10">
              [Y]
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAnswer("NO")}
            className={`py-5 px-6 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-3 min-h-[56px] border-2 shadow-subtle ${
              currentAnswer === "NO"
                ? "bg-primary text-white border-primary ring-4 ring-primary/20 scale-[1.01]"
                : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
            }`}
            id="answer-no-btn"
          >
            <span>No</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-xs font-mono font-medium opacity-60 bg-black/10 dark:bg-white/10">
              [N]
            </span>
          </button>
        </div>

        {/* Navigation Controls: Previous / Next / Complete */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-5 py-2.5 rounded-xl border border-border text-foreground font-semibold text-sm flex items-center gap-2 disabled:opacity-40 min-h-[48px] hover:bg-muted transition-colors"
            id="prev-question-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex < config.questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(config.questions.length - 1, prev + 1))}
              className="px-6 py-2.5 rounded-xl bg-muted hover:bg-border text-foreground font-bold text-sm flex items-center gap-2 min-h-[48px] transition-colors"
              id="next-question-btn"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-7 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-subtle transition-all flex items-center gap-2 min-h-[48px]"
              id="submit-screening-btn"
            >
              <span>{submitting ? "Scoring Results..." : "Complete & View Results"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Video Demonstration Modal Placeholder */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl max-w-md w-full p-6 space-y-4 border border-border shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                <span>Behavior Demonstration Slot</span>
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-foreground-muted hover:text-foreground p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-muted rounded-2xl border border-border flex flex-col items-center justify-center p-4 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <p className="text-sm text-foreground font-bold">
                Clinical Observation Model: "{currentQuestion.category}"
              </p>
              <span className="text-xs text-foreground-muted">
                (Standardized instructional demonstration slot)
              </span>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Demonstrates typical behavioral benchmarks versus observations that indicate developmental variations.
            </p>
            <button
              onClick={() => setShowVideoModal(false)}
              className="w-full py-3 rounded-xl bg-primary text-white text-sm font-bold min-h-[48px]"
            >
              Back to Questionnaire
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScreeningPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-foreground-muted">Loading standardized instrument...</div>}>
      <ScreeningFlow />
    </Suspense>
  );
}
