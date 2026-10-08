"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  ShieldAlert,
  ArrowRight,
  Baby,
  ClipboardCheck,
  FileText,
  Lock,
  Heart,
  Sparkles,
  Users,
  AlertTriangle,
  Stethoscope,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50/60 via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pt-10 pb-16 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Demo Access Bar for Evaluators */}
          <div className="mb-8 p-3 rounded-xl bg-cyan-100/70 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-900 dark:text-cyan-200 font-medium">
              <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
              <span><strong>Demo Ready:</strong> Seeded with Priya Sharma &amp; 3 children (14m Aarav, 24m Meera, 40m Kabir).</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold transition-colors min-h-[36px] flex items-center"
              >
                Open Parent Dashboard
              </Link>
              <Link
                href="/clinician"
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-semibold transition-colors min-h-[36px] flex items-center"
              >
                Clinician Portal
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Age Band Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-xs font-semibold">
                <Baby className="w-4 h-4" />
                <span>Pediatric Developmental Screener • Ages 12 to 48 Months</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {t.landing.heroTitle}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {t.landing.heroSubtitle}
              </p>

              {/* Mandatory Clinical Distinction Notice */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs leading-relaxed">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Critical Medical Notice:</strong>
                  EarlySteps provides developmental <strong>SCREENING</strong>, not a medical diagnosis. It identifies
                  subtle social-communication patterns to help you consult your pediatrician or developmental specialist
                  with confidence.
                </div>
              </div>

              {/* Primary Call-to-Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-base shadow-soft hover:shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>{t.landing.startCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-base hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center justify-center min-h-[48px]"
                >
                  {t.landing.learnMore}
                </Link>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
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
                  <span>PDF Report for Pediatrician</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                      <Baby className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">Sample Child Profile</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Meera • 24 months old</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Active
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <span>Standardized Questionnaire</span>
                      <span className="font-bold text-cyan-600">M-CHAT-R/F</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Validated for ages 16–30 months (20 sensory and interaction items)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <span>Screening Result Tier</span>
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Medium Likelihood
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Medium likelihood of needing further evaluation • Follow-up recommended
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
                  >
                    <span>View Interactive Child Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who It's For & Age Bands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Designed for Toddlers &amp; Preschoolers (12 to 48 Months)
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Early identification creates opportunities for supportive intervention when the brain is most adaptable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 12-15m */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-semibold inline-block mb-3">
              Requires Clinician-Approved Content
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">12 – 15 Months</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Infant social-communication milestones (vocal turns, visual following, name response).
            </p>
            <div className="text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-3">
              <strong>Status:</strong> Clinical draft placeholder under review. Direct pediatrician guidance advised.
            </div>
          </div>

          {/* 16-30m (Active) */}
          <div className="p-6 rounded-2xl bg-cyan-50/60 dark:bg-slate-800 border-2 border-cyan-600 dark:border-cyan-500 shadow-md relative overflow-hidden">
            <div className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold inline-block mb-3">
              Clinically Validated • Active
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">16 – 30 Months</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              Standardized M-CHAT-R/F (20 questions with everyday examples, joint attention, and imitation).
            </p>
            <div className="text-xs text-cyan-900 dark:text-cyan-200 border-t border-cyan-200 dark:border-cyan-800 pt-3 font-medium">
              <strong>Scoring Engine:</strong> Fully operational with instant pediatric classification.
            </div>
          </div>

          {/* 31-48m */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-semibold inline-block mb-3">
              Requires Clinician-Approved Content
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">31 – 48 Months</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Preschool peer interaction, multi-word communication, and imaginative pretend play.
            </p>
            <div className="text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-3">
              <strong>Status:</strong> Clinical draft placeholder. Consult pediatric specialist.
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (3 Steps) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.landing.howItWorksTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            A stress-free, parent-guided workflow designed to take less than 10 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-lg">
              <Baby className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.landing.step1Title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.landing.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-lg">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.landing.step2Title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.landing.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
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

      {/* 4. Trust & DPDP Act 2023 Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-semibold">
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
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <strong className="block text-emerald-400 font-bold mb-1">Verifiable Consent</strong>
                  Clear, plain-language consent versioning before any screening data is recorded.
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <strong className="block text-emerald-400 font-bold mb-1">Data Minimization</strong>
                  No biometric capture. Only age and developmental observations needed for screening.
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <strong className="block text-emerald-400 font-bold mb-1">Right to Erasure</strong>
                  One-click "Delete-My-Data" permanently purges children, answers, and evaluations.
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/privacy"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-center text-sm transition-colors min-h-[48px] flex items-center justify-center"
              >
                Explore DPDP Privacy Rights
              </Link>
              <Link
                href="/dashboard"
                className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-center text-sm transition-colors min-h-[48px] flex items-center justify-center"
              >
                Start Screening Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Additional Features Quick Grid (Milestones & Specialists) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Developmental Milestones Tracker</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Track speech, eye contact, pointing, and play for 12, 18, 24, 36, and 48 months with gentle sensory-friendly suggestions.
              </p>
            </div>
            <Link
              href="/milestones"
              className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <span>Explore Milestones Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Find Pediatric Specialists</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Connect with leading developmental pediatric centers (AIIMS, NIMHANS, KEM, Manipal, Rainbow) with one-click Google Maps links.
              </p>
            </div>
            <Link
              href="/specialists"
              className="text-xs font-semibold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <span>View Specialists Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
