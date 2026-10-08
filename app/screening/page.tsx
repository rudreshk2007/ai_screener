"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
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
  Sparkles,
  Keyboard,
  Eye,
  SlidersHorizontal,
  Volume2,
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
  const [sensoryCalmMode, setSensoryCalmMode] = useState(false);

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

      // Auto-advance if not last
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
      // Ignore if typing inside input or textarea
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
        <div className="relative">
          <div className="w-12 h-12 border-4 border-cyan-200 dark:border-cyan-900 border-t-cyan-600 rounded-full animate-spin"></div>
          <Sparkles className="w-5 h-5 text-cyan-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">Initializing Clinical Screening Instrument</p>
          <p className="text-xs text-slate-500 font-medium">Standardized age-band protocol loading...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 mx-auto flex items-center justify-center shadow-soft">
          <Baby className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Select a Child to Begin</h2>
        <p className="text-xs text-slate-500">
          Please add or select a child profile to calibrate the age-appropriate standardized instrument.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-5 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-semibold shadow-soft transition-all"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = config.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / config.questions.length) * 100);
  const currentAnswer = answers[currentQuestion.id];
  const totalAnsweredCount = Object.keys(answers).length;
  const allAnswered = config.questions.every((q: any) => answers[q.id]);

  return (
    <div className={`max-w-3xl mx-auto px-4 py-8 space-y-6 transition-colors duration-300 ${
      sensoryCalmMode ? "font-sans grayscale-[15%] contrast-[95%]" : ""
    }`}>
      {/* Clinician-Approved Banner if placeholder */}
      {config.isPlaceholder && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Requires Clinician-Approved Content</span>
          </div>
          <p className="text-xs leading-relaxed">{config.clinicianBanner}</p>
        </div>
      )}

      {/* Top Header Bar: Child Selector + Instrument Pill + Sensory Calm Switch */}
      <div className="bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                aria-label="Select child profile for screening"
                className="text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 min-h-[36px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {children.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({Math.floor((new Date().getTime() - new Date(c.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30.4375))}m)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sensory Calm Mode & Auto-save status */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSensoryCalmMode(!sensoryCalmMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all min-h-[36px] ${
              sensoryCalmMode
                ? "bg-slate-800 text-slate-100 border-slate-700 shadow-inner"
                : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-cyan-300"
            }`}
            title="Calm sensory-friendly mode with softened colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600" />
            <span>{sensoryCalmMode ? "Sensory Calm: On" : "Calm Mode"}</span>
          </button>

          {autoSaved ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px] animate-fade-in">
              <Save className="w-3.5 h-3.5" /> Saved
            </span>
          ) : (
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">
              Cloud Sync Active
            </span>
          )}
        </div>
      </div>

      {/* Progress & Quick-Jump Step Navigator */}
      <div className="bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-soft space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              Question {currentIndex + 1} of {config.questions.length}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-cyan-700 dark:text-cyan-400">
              {totalAnsweredCount} answered
            </span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Accessible Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-label="Screening completion progress"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Step Chips Matrix (Quick Jump) */}
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
                className={`w-7 h-7 rounded-lg text-[11px] font-bold shrink-0 transition-all flex items-center justify-center ${
                  isCurrent
                    ? "bg-cyan-700 text-white shadow-sm ring-2 ring-cyan-300 dark:ring-cyan-800 scale-105"
                    : isAnswered
                    ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Single-Question Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-9 border border-slate-200/90 dark:border-slate-700/90 shadow-card space-y-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>

        {/* Category & Video Tooltip */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800">
              Domain: {currentQuestion.category}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors min-h-[44px]"
            title="Video guide placeholder"
            aria-label="View video guide placeholder"
          >
            <Video className="w-4 h-4 text-cyan-600" />
            <span className="hidden sm:inline font-bold">Watch Video Example</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="space-y-4 relative z-10">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.text}
          </h1>

          {/* Everyday Concrete Parent Example */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-cyan-50/30 dark:from-slate-900 dark:to-cyan-950/20 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span className="text-[11px] font-bold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider">
                Everyday Example:
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {currentQuestion.exampleText}
            </p>
          </div>
        </div>

        {/* Big Tap Target Answer Buttons (>= 56px height for effortless mobile tapping) */}
        <div className="grid grid-cols-2 gap-4 pt-2 relative z-10">
          <button
            type="button"
            onClick={() => handleAnswer("YES")}
            className={`py-4 sm:py-5 px-6 rounded-2xl text-base sm:text-lg font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 min-h-[60px] border-2 shadow-sm ${
              currentAnswer === "YES"
                ? "bg-cyan-700 text-white border-cyan-700 ring-4 ring-cyan-100 dark:ring-cyan-900 shadow-md scale-[1.01]"
                : "bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-cyan-400 hover:bg-cyan-50/30 dark:hover:bg-slate-750"
            }`}
            id="answer-yes-btn"
          >
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Yes</span>
            </div>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium opacity-70 bg-black/10 dark:bg-white/10">
              [Y]
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAnswer("NO")}
            className={`py-4 sm:py-5 px-6 rounded-2xl text-base sm:text-lg font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 min-h-[60px] border-2 shadow-sm ${
              currentAnswer === "NO"
                ? "bg-cyan-700 text-white border-cyan-700 ring-4 ring-cyan-100 dark:ring-cyan-900 shadow-md scale-[1.01]"
                : "bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-cyan-400 hover:bg-cyan-50/30 dark:hover:bg-slate-750"
            }`}
            id="answer-no-btn"
          >
            <div className="flex items-center gap-2">
              <span>No</span>
            </div>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium opacity-70 bg-black/10 dark:bg-white/10">
              [N]
            </span>
          </button>
        </div>

        {/* Keyboard Shortcut Hint Pill */}
        <div className="hidden sm:flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keyboard shortcuts:</span>
          </div>
          <span className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Y</span>
          <span>= Yes</span>
          <span className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">N</span>
          <span>= No</span>
          <span className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">← / →</span>
          <span>= Navigate</span>
        </div>

        {/* Navigation Controls: Previous / Next / Submit */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 min-h-[44px] hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            id="prev-question-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentIndex < config.questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(config.questions.length - 1, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 min-h-[44px] transition-colors"
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-soft transition-all flex items-center gap-2 min-h-[44px] scale-[1.02]"
              id="submit-screening-btn"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? "Scoring Results..." : "Complete & Generate Report"}</span>
              <ArrowRight className="w-4 h-4" />
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
                <span>Behavior Demonstration Guide</span>
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-cyan-50 dark:from-slate-900 dark:to-cyan-950/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-cyan-600 animate-pulse" />
              <p className="text-xs text-slate-700 dark:text-slate-200 font-bold">
                Clinical Observation Model: "{currentQuestion.category}"
              </p>
              <span className="text-[11px] text-slate-500">
                (Standardized 15-second instructional video slot with subtitles)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This video demonstrates common behavioral benchmarks versus developmental variations to help clarify your observation before recording an answer.
            </p>
            <button
              onClick={() => setShowVideoModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold min-h-[44px] transition-colors"
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
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading standardized instrument...</div>}>
      <ScreeningFlow />
    </Suspense>
  );
}
