"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  Baby,
  ArrowRight,
  ShieldCheck,
  ClipboardCheck,
  FileText,
  Lock,
  Sparkles,
  AlertTriangle,
  Stethoscope,
  Activity,
  CheckCircle2,
  Clock,
  Download,
  Sliders,
  ChevronRight,
  Eye,
  Smile,
  Compass,
} from "lucide-react";

export default function LandingPage() {
  const { t } = useLanguage();

  // Interactive Age Protocol Simulator
  const [simulatorAge, setSimulatorAge] = useState<number>(24);

  const getProtocolInfo = (age: number) => {
    if (age >= 16 && age <= 30) {
      return {
        protocol: "M-CHAT-R/F (Validated Standard)",
        badge: "Standardized • 20 Items",
        badgeColor: "emerald",
        time: "4–6 Minutes",
        description: "Evaluates joint attention, proto-declarative pointing, imitation, and social reciprocity.",
        status: "Active & Clinically Validated",
        isReady: true,
      };
    } else if (age < 16) {
      return {
        protocol: "Infant Developmental Surveillance (12–15m)",
        badge: "Clinical Draft • Review Pending",
        badgeColor: "amber",
        time: "2–3 Minutes",
        description: "Monitors early auditory responsiveness, visual eye tracking, and babbling turn-taking.",
        status: "Requires Clinician Approval",
        isReady: false,
      };
    } else {
      return {
        protocol: "Preschool Social-Communication Screener (31–48m)",
        badge: "Clinical Draft • Review Pending",
        badgeColor: "amber",
        time: "3–4 Minutes",
        description: "Assesses cooperative peer play, symbolic pretend play, and multi-word reciprocal dialogue.",
        status: "Requires Clinician Approval",
        isReady: false,
      };
    }
  };

  const protocol = getProtocolInfo(simulatorAge);

  return (
    <div className="space-y-20 pb-16 overflow-hidden">
      {/* 1. Hero Section with Glow Accents */}
      <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-cyan-50/70 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-400/15 to-teal-400/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Quick Demo Credentials Bar */}
          <div className="mb-10 p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-cyan-200/80 dark:border-cyan-800/70 shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-cyan-950 dark:text-cyan-200 font-semibold">
              <span className="p-1 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span>
                <strong>Pre-Seeded Clinical Demo:</strong> Priya Sharma with 3 children (14m Aarav, 24m Meera, 40m Kabir) ready to test.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold transition-all min-h-[38px] flex items-center gap-1 shadow-sm"
              >
                <span>Parent Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/clinician"
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all min-h-[38px] flex items-center"
              >
                Clinician Portal
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Age Band Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/90 dark:bg-cyan-950/90 border border-cyan-300 dark:border-cyan-800 text-cyan-900 dark:text-cyan-300 text-xs font-bold shadow-xs">
                <Baby className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Designed for Toddlers & Preschoolers (12 to 48 Months)</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Empowering Parents with Gentle,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-600 dark:from-cyan-400 dark:to-teal-300">
                  Science-Backed
                </span>{" "}
                Screening
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Standardized, pediatrician-aligned developmental screening designed specifically for parents of children aged 12 to 48 months. Confidential, compassionate, and DPDP-compliant.
              </p>

              {/* Medical Notice Alert */}
              <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 flex items-start gap-3 text-xs leading-relaxed shadow-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5 uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Non-Diagnostic Screening Instrument:
                  </strong>
                  EarlySteps provides developmental SCREENING, not a medical diagnosis. Results help parents and pediatricians discuss milestones with objective data.
                </div>
              </div>

              {/* Call-to-Actions */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <Link
                  href="/dashboard"
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-700 via-teal-600 to-emerald-600 hover:opacity-95 text-white font-extrabold text-sm shadow-soft hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[50px]"
                >
                  <span>Start Free Child Screening</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#simulator"
                  className="px-6 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center justify-center min-h-[50px] shadow-sm"
                >
                  <Sliders className="w-4 h-4 mr-2 text-cyan-600" />
                  Try Age Simulator
                </Link>
              </div>

              {/* Trust Checkmarks */}
              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Standardized M-CHAT-R/F</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>India DPDP Act 2023 Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant Doctor PDF Report</span>
                </div>
              </div>
            </div>

            {/* Interactive Live Hero Widget */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/90 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-soft">
                      M
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">Meera Sharma</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">24 Months Old • Toddler</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Medium Risk (4/20)
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>Clinical Classification</span>
                      <span className="text-amber-600 dark:text-amber-400">Follow-up Advised</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      "Medium likelihood of needing further evaluation" — Follow-up observation recommended by specialist.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900 text-cyan-950 dark:text-cyan-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                      <span className="font-semibold text-xs">Doctor-Ready PDF</span>
                    </div>
                    <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300">Ready to print</span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px]"
                >
                  <span>Launch Parent Portal Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SaaS Stat Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="text-center p-3 border-r border-slate-800 last:border-none">
            <span className="text-3xl sm:text-4xl font-black text-cyan-400 block tracking-tight">20</span>
            <span className="text-xs text-slate-300 font-semibold mt-1 block">Standardized Indicators</span>
          </div>
          <div className="text-center p-3 border-r border-slate-800 last:border-none">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 block tracking-tight">100%</span>
            <span className="text-xs text-slate-300 font-semibold mt-1 block">DPDP Act 2023 Compliant</span>
          </div>
          <div className="text-center p-3 border-r border-slate-800 last:border-none">
            <span className="text-3xl sm:text-4xl font-black text-cyan-400 block tracking-tight">&lt; 5 min</span>
            <span className="text-xs text-slate-300 font-semibold mt-1 block">Quick Completion</span>
          </div>
          <div className="text-center p-3">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 block tracking-tight">1-Click</span>
            <span className="text-xs text-slate-300 font-semibold mt-1 block">Pediatrician PDF Report</span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Age Protocol Simulator */}
      <section id="simulator" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center justify-center gap-1.5">
              <Sliders className="w-4 h-4" />
              Interactive Protocol Matcher
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Slide to Match Your Child's Exact Age
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Select your child's age in months to see which standardized screening protocol applies automatically.
            </p>
          </div>

          {/* Slider Control */}
          <div className="space-y-3 max-w-md mx-auto pt-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-500">Age in Months:</span>
              <span className="px-3 py-1 rounded-xl bg-cyan-700 text-white text-base">
                {simulatorAge} Months
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="48"
              step="1"
              value={simulatorAge}
              onChange={(e) => setSimulatorAge(Number(e.target.value))}
              className="w-full accent-cyan-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              aria-label="Child age in months slider"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>12m</span>
              <span>16m (M-CHAT-R Start)</span>
              <span>30m (M-CHAT-R End)</span>
              <span>48m</span>
            </div>
          </div>

          {/* Protocol Card Result */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-4 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{protocol.protocol}</h3>
                <span className="text-xs text-slate-500">Target Range: {simulatorAge} Months</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                  protocol.isReady
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {protocol.badge}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {protocol.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-600" />
                <span>Estimated Duration: <strong>{protocol.time}</strong></span>
              </div>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Screen Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works (3 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
            Guided Parent Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.landing.howItWorksTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            A stress-free workflow designed to take less than 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-lg">
              <Baby className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.landing.step1Title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.landing.step1Desc}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-lg">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.landing.step2Title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.landing.step2Desc}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.landing.step3Title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.landing.step3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Trust & DPDP Act 2023 Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>India Digital Personal Data Protection Act 2023 Compliant</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t.landing.trustTitle}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                {t.landing.trustDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <strong className="block text-emerald-400 font-bold">Verifiable Consent</strong>
                  Clear, plain-language consent versioning before any screening data is recorded.
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <strong className="block text-emerald-400 font-bold">Data Minimization</strong>
                  No biometric capture. Only age and developmental observations needed for screening.
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <strong className="block text-emerald-400 font-bold">Right to Erasure</strong>
                  One-click "Delete-My-Data" permanently purges children, answers, and evaluations.
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/privacy"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center text-sm transition-colors min-h-[48px] flex items-center justify-center shadow-md"
              >
                Explore DPDP Privacy Rights
              </Link>
              <Link
                href="/dashboard"
                className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-center text-sm transition-colors min-h-[48px] flex items-center justify-center"
              >
                Start Screening Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
