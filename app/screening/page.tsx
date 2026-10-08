"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import {
  Baby,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Video,
  Check,
  Save,
  AlertTriangle,
  HelpCircle,
  Sparkles,
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
  const [showVideoModal, setShowVideoModal] = useState(false);

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
  const handleAnswer = async (response: "YES" | "NO") => {
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

    // Auto-advance if not last
    if (currentIndex < config.questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    }
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium">Preparing standardized screening...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <Baby className="w-12 h-12 text-cyan-600 mx-auto" />
        <h2 className="text-xl font-bold">Select a Child to Begin</h2>
        <p className="text-xs text-slate-500">
          Please add or select a child to load the appropriate standardized age band.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-cyan-700 text-white rounded-xl text-xs font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = config.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / config.questions.length) * 100);
  const currentAnswer = answers[currentQuestion.id];
  const allAnswered = config.questions.every((q: any) => answers[q.id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Clinician-Approved Banner if placeholder */}
      {config.isPlaceholder && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Requires Clinician-Approved Content</span>
          </div>
          <p className="text-xs leading-relaxed">{config.clinicianBanner}</p>
        </div>
      )}

      {/* Header bar with child select & progress */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Baby className="w-5 h-5 text-cyan-600" />
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            aria-label="Select child profile for screening"
            className="text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 min-h-[36px]"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">
            {config.shortName} • {currentIndex + 1} of {config.questions.length}
          </span>
          {autoSaved && (
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              <Save className="w-3 h-3" /> Auto-saved
            </span>
          )}
        </div>
      </div>

      {/* Accessible Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span>{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-teal-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-label="Screening completion progress"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Main Single-Question Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-card space-y-6">
        {/* Category & Tooltip */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800">
            Category: {currentQuestion.category}
          </span>

          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 p-1 min-h-[44px]"
            title="Video guide placeholder"
            aria-label="View video guide placeholder"
          >
            <Video className="w-4 h-4 text-cyan-600" />
            <span className="hidden sm:inline">Video Example</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQuestion.text}
          </h1>

          {/* Everyday Concrete Parent Example */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider block">
              Everyday Example:
            </span>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentQuestion.exampleText}
            </p>
          </div>
        </div>

        {/* Big Tap Target Answer Buttons (>= 56px height for effortless mobile tapping) */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            onClick={() => handleAnswer("YES")}
            className={`py-4 px-6 rounded-2xl text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-2 min-h-[56px] border-2 shadow-sm ${
              currentAnswer === "YES"
                ? "bg-cyan-700 text-white border-cyan-700 ring-4 ring-cyan-100 dark:ring-cyan-900"
                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
            id="answer-yes-btn"
          >
            <Check className="w-5 h-5" />
            <span>Yes</span>
          </button>

          <button
            type="button"
            onClick={() => handleAnswer("NO")}
            className={`py-4 px-6 rounded-2xl text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-2 min-h-[56px] border-2 shadow-sm ${
              currentAnswer === "NO"
                ? "bg-cyan-700 text-white border-cyan-700 ring-4 ring-cyan-100 dark:ring-cyan-900"
                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
            id="answer-no-btn"
          >
            <span>No</span>
          </button>
        </div>

        {/* Navigation Controls: Previous / Next / Submit */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 min-h-[44px]"
            id="prev-question-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentIndex < config.questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(config.questions.length - 1, prev + 1))}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 min-h-[44px]"
              id="next-question-btn"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft transition-colors flex items-center gap-1.5 min-h-[44px]"
              id="submit-screening-btn"
            >
              <span>{submitting ? "Scoring Results..." : "Complete & View Results"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Video Tooltip Modal Placeholder */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-600" />
                <span>Video Demonstration Placeholder</span>
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-cyan-600" />
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Clinical demonstration clip: "{currentQuestion.category}"
              </p>
              <span className="text-[10px] text-slate-400">
                (Standardized 15-second instructional video slot)
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This video demonstrates typical behavior versus observations that may indicate developmental variation.
            </p>
            <button
              onClick={() => setShowVideoModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-700 text-white text-xs font-semibold min-h-[44px]"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScreeningPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading screening instrument...</div>}>
      <ScreeningFlow />
    </Suspense>
  );
}
