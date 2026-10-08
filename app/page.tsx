"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Baby,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  Stethoscope,
  ChevronDown,
  Lock,
  FileText,
  Activity,
  Heart,
  HelpCircle,
  ExternalLink,
  Sparkles,
  XCircle,
  Eye,
  FileCheck,
} from "lucide-react";

export default function LandingPage() {
  const [activePreviewTab, setActivePreviewTab] = useState<"result" | "pdf" | "milestones">("result");

  const faqs = [
    {
      q: "Is EarlySteps a medical diagnosis?",
      a: "No. EarlySteps is strictly a developmental screening tool, not a medical diagnosis. It helps parents observe behaviors like pointing, responding to names, and pretend play in a standardized format. A screening identifies whether your child may benefit from further developmental evaluation by a pediatrician or specialist.",
    },
    {
      q: "At what age should I screen my toddler?",
      a: "The standardized M-CHAT-R/F instrument is clinically validated for toddlers between 16 and 30 months of age. The American Academy of Pediatrics (AAP) recommends developmental surveillance during regular well-child visits at 9, 18, and 30 months, with dedicated autism-specific screening at 18 and 24 months.",
    },
    {
      q: "How long does the questionnaire take?",
      a: "The screening typically takes 8 to 10 minutes. There are 20 straightforward Yes/No questions regarding everyday observations, each accompanied by realistic examples from family routines.",
    },
    {
      q: "What is the M-CHAT-R/F?",
      a: "The Modified Checklist for Autism in Toddlers, Revised with Follow-Up (M-CHAT-R/F) is a widely published, peer-reviewed screening instrument developed by clinical researchers (Robins et al., Pediatrics 2014) to assess early social-communication milestones.",
    },
    {
      q: "What happens if our result shows 'Medium' or 'High' likelihood?",
      a: "A Medium or High screening score is not a diagnosis. It simply indicates that your child exhibits behaviors that developmental pediatricians recommend evaluating more closely. EarlySteps generates a structured PDF summary that you can hand directly to your doctor to guide your discussion.",
    },
    {
      q: "How is my child's health data protected?",
      a: "EarlySteps adheres strictly to India's Digital Personal Data Protection (DPDP) Act 2023. We collect only what is strictly necessary (data minimization), maintain versioned parental consent, never use third-party advertising cookies, and provide a one-click permanent 'Delete-My-Data' feature that immediately purges your entire account and records from our database.",
    },
    {
      q: "Can I delete our family's data after viewing the report?",
      a: "Yes, at any time. Under DPDP Act 2023 Right to Erasure, visiting our Privacy Center allows you to permanently erase all child profiles, answers, and screening results with zero lingering records.",
    },
    {
      q: "Is EarlySteps free to use?",
      a: "Yes. EarlySteps is completely free for parents, families, and primary care pediatricians to support accessible early developmental surveillance.",
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* ===================================================================
          1. HERO SECTION
          =================================================================== */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-border/80">
        {/* Soft Warm Pediatric Blobs (Calm, sensory-friendly inline accents) */}
        <div
          aria-hidden="true"
          className="absolute top-10 right-10 w-96 h-96 bg-primary-soft/50 rounded-full blur-3xl pointer-events-none -z-10"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-10 left-10 w-80 h-80 bg-warm-soft/60 rounded-full blur-3xl pointer-events-none -z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow Label (Max 1 per section per guidelines) */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-soft text-primary text-sm font-bold border border-primary/20">
                <Baby className="w-4 h-4 text-primary" />
                <span>Designed for Toddlers & Preschoolers (12 to 48 Months)</span>
              </div>

              {/* Display H1 (Tight 1.15 line-height, Plus Jakarta Sans) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-foreground leading-[1.15]">
                Early answers for your toddler's development.
              </h1>

              {/* Subhead (Plain language, max 2 lines, 17-18px body) */}
              <p className="text-lg sm:text-xl text-foreground-muted leading-relaxed max-w-2xl">
                A calm, gentle screening questionnaire for parents of children aged 12 to 48 months. Get structured observations to share with your pediatrician.
              </p>

              {/* Prominent Medical Notice */}
              <div
                role="note"
                className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-sm leading-relaxed space-y-1"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Important Clinical Guidance</span>
                </div>
                <p>
                  EarlySteps provides developmental <strong>SCREENING</strong>, not a medical diagnosis. Results help parents and pediatricians discuss milestones with objective data.
                </p>
              </div>

              {/* Action Buttons (Primary & Secondary, 48px min height) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/screening"
                  className="px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-card hover:shadow-hover transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Start free screening</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="px-7 py-3.5 rounded-2xl bg-card hover:bg-muted border border-border text-foreground font-semibold text-base shadow-subtle transition-all flex items-center justify-center min-h-[48px]"
                >
                  See how it works
                </a>
              </div>

              {/* 3 Small Trust Points Under CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-sm text-foreground-muted font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Takes ~10 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Private by design</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Doctor-ready report</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sample Result Product Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-card border-2 border-border shadow-card p-6 sm:p-7 space-y-6 relative card-hover">
                {/* Sample Result Header Badge */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-warm-soft text-warm border border-warm/20">
                      SAMPLE RESULT
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground-muted">
                    Fictional Preview
                  </span>
                </div>

                {/* Child Identifier (Clean fictional child, 24 months) */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-bold text-xl">
                    S
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Sample child, 24 months</h2>
                    <p className="text-sm text-foreground-muted">Standardized M-CHAT-R/F Protocol</p>
                  </div>
                </div>

                {/* Risk Classification Banner */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-base">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Medium likelihood of needing further evaluation</span>
                  </div>
                  <p className="text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                    Some observed responses suggest developmental variations that warrant a dedicated discussion with your pediatrician.
                  </p>
                </div>

                {/* What Doctor Receives */}
                <div className="space-y-2 pt-1 text-sm text-foreground-muted">
                  <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                    <span>Clinical Score Placement:</span>
                    <strong className="text-foreground">4 / 20 points</strong>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                    <span>Key Focus Domain:</span>
                    <strong className="text-foreground">Joint Attention & Pointing</strong>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span>Action Item:</span>
                    <strong className="text-primary font-bold">Pediatrician Referral Check</strong>
                  </div>
                </div>

                {/* Sample Download CTA */}
                <div className="pt-2">
                  <div className="w-full py-3 px-4 rounded-xl bg-muted text-foreground font-semibold text-sm flex items-center justify-center gap-2 border border-border">
                    <Download className="w-4 h-4 text-primary" />
                    <span>Printable 1-Page Pediatrician Brief</span>
                  </div>
                  <p className="text-xs text-foreground-muted text-center mt-2">
                    Non-diagnostic screening summary • Confidential
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. HOW IT WORKS (3 steps with icons)
          =================================================================== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Step-by-Step Walkthrough
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            How EarlySteps works in 3 gentle steps
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            A stress-free, parent-guided workflow designed to take less than 10 minutes at home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="rounded-3xl bg-card border border-border p-8 space-y-5 shadow-subtle card-hover">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-bold text-xl">
              <Baby className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 1</span>
              <h3 className="text-xl font-bold text-foreground">Add your child</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Enter your toddler's birth date. EarlySteps automatically calculates their exact age in months to load the appropriate standardized questionnaire band.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl bg-card border border-border p-8 space-y-5 shadow-subtle card-hover">
            <div className="w-14 h-14 rounded-2xl bg-warm-soft text-warm flex items-center justify-center font-bold text-xl">
              <FileCheck className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-warm uppercase tracking-wider">Step 2</span>
              <h3 className="text-xl font-bold text-foreground">Answer simple questions</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Respond to 20 clear yes/no questions about everyday observations—like pointing, making eye contact, and pretend play—with helpful everyday examples.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl bg-card border border-border p-8 space-y-5 shadow-subtle card-hover">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-bold text-xl">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 3</span>
              <h3 className="text-xl font-bold text-foreground">Get a report for your doctor</h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Receive an objective, non-diagnostic observation summary report. Download the clean PDF to bring to your next pediatric consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. WHAT YOU'LL GET (Result Preview + PDF Preview + Milestones)
          =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Comprehensive Deliverables
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            What you receive after screening
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            Objective, clear tools designed to facilitate compassionate conversations with developmental healthcare providers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-muted border border-border gap-2" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activePreviewTab === "result"}
              onClick={() => setActivePreviewTab("result")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all min-h-[44px] ${
                activePreviewTab === "result"
                  ? "bg-card text-foreground shadow-subtle"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Interactive Result Screen
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePreviewTab === "pdf"}
              onClick={() => setActivePreviewTab("pdf")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all min-h-[44px] ${
                activePreviewTab === "pdf"
                  ? "bg-card text-foreground shadow-subtle"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Doctor-Ready PDF Report
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePreviewTab === "milestones"}
              onClick={() => setActivePreviewTab("milestones")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all min-h-[44px] ${
                activePreviewTab === "milestones"
                  ? "bg-card text-foreground shadow-subtle"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Age Milestones Tracker
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-card">
          {activePreviewTab === "result" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Screening Results Screen</span>
                <h3 className="text-2xl font-bold font-heading text-foreground">
                  Immediate, plain-language classification
                </h3>
                <p className="text-base text-foreground-muted leading-relaxed">
                  Instead of cryptic medical jargon, EarlySteps presents a clear three-tier likelihood indicator: Low, Medium, or High likelihood of needing further evaluation.
                </p>
                <ul className="space-y-2.5 text-base text-foreground-muted pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>Color + icon + text used simultaneously for accessibility</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>Plain-language explanation of what the score means</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>Actionable "What to do next" recommendations</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-background border border-border space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm font-bold text-foreground">Screening Evaluation Summary</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Low Likelihood (Typical)
                  </span>
                </div>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  "Low likelihood of needing further evaluation. Child meets typical social-communication milestones for age."
                </p>
                <div className="p-3 rounded-xl bg-card border border-border text-xs text-foreground-muted">
                  Next step: Re-screen at 24 months during well-child pediatric checkup.
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === "pdf" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Clinical PDF Export</span>
                <h3 className="text-2xl font-bold font-heading text-foreground">
                  Formatted specifically for pediatricians
                </h3>
                <p className="text-base text-foreground-muted leading-relaxed">
                  Pediatricians appreciate structured data. The downloadable PDF organizes observations into clinical domains like joint attention, imitation, and sensory responses.
                </p>
                <ul className="space-y-2.5 text-base text-foreground-muted pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>Standardized M-CHAT-R/F item-by-item breakdown</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>Prominent mandatory non-diagnostic notice for doctor</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>Date of birth, chronological age, and gestational notes</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-background border border-border space-y-3 font-mono text-xs">
                <div className="border-b border-border pb-2 flex justify-between font-bold text-foreground">
                  <span>EarlySteps Clinical Report</span>
                  <span>PDF v1.0</span>
                </div>
                <div className="space-y-1 text-foreground-muted">
                  <div>Patient: Anonymized Child (24m)</div>
                  <div>Instrument: M-CHAT-R/F Validated Band</div>
                  <div>Observation items recorded: 20/20</div>
                  <div>Risk Category: Low Likelihood</div>
                </div>
                <div className="p-2.5 bg-card rounded-lg text-primary text-[11px] font-sans">
                  Notice: Standardized pediatric surveillance aid. Non-diagnostic.
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === "milestones" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Developmental Guide</span>
                <h3 className="text-2xl font-bold font-heading text-foreground">
                  Age-wise milestone tracking (12 to 48 months)
                </h3>
                <p className="text-base text-foreground-muted leading-relaxed">
                  Explore expected milestones in speech, eye contact, pointing, and cooperative play across 12, 18, 24, 36, and 48 months.
                </p>
                <div className="pt-2">
                  <Link
                    href="/milestones"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    <span>Explore interactive Milestones Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                  <span className="font-bold text-foreground block">12–15 Months</span>
                  <p className="text-foreground-muted">Responds to name, babbles with intonation, waves bye-bye.</p>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                  <span className="font-bold text-foreground block">16–24 Months</span>
                  <p className="text-foreground-muted">Points to show interest, brings toys to show, imitates actions.</p>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                  <span className="font-bold text-foreground block">25–36 Months</span>
                  <p className="text-foreground-muted">2-word phrases, pretend play with dolls, follows 2-step directions.</p>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                  <span className="font-bold text-foreground block">37–48 Months</span>
                  <p className="text-foreground-muted">Plays cooperatively with peers, tells simple stories, asks 'why'.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================
          4. WHO IT'S FOR / WHAT IT'S NOT (Two Clear Columns)
          =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Clear Scope & Intent
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Who EarlySteps is for — and what it is not
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
            Maintaining clear boundaries between early surveillance and formal clinical diagnosis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column A: Who it is for */}
          <div className="rounded-3xl bg-card border-2 border-primary/20 p-8 sm:p-10 space-y-6 shadow-subtle">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-foreground">Who it is for</h3>
            </div>

            <ul className="space-y-4 text-base text-foreground-muted">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Parents of toddlers aged 12 to 48 months</strong> who have questions about social interactions, pointing, eye contact, or speech development.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Families preparing for pediatric checkups</strong> who want objective, structured observational notes to discuss with their doctor.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Caregivers seeking early surveillance</strong> to monitor milestones systematically without pressure or alarming labels.
                </span>
              </li>
            </ul>
          </div>

          {/* Column B: What it is not */}
          <div className="rounded-3xl bg-card border-2 border-border p-8 sm:p-10 space-y-6 shadow-subtle">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-foreground">What it is NOT</h3>
            </div>

            <ul className="space-y-4 text-base text-foreground-muted">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>NOT a medical diagnosis.</strong> EarlySteps cannot diagnose autism spectrum disorder, developmental delay, or any medical condition.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>NOT a replacement for a pediatrician.</strong> A comprehensive developmental evaluation requires direct clinical examination by a developmental pediatrician or child psychologist.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>NOT an emergency clinical instrument.</strong> If your child is experiencing medical distress or acute regression, contact your pediatrician immediately.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. PRIVACY & CONSENT (Plain Language + Published Citation)
          =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="rounded-3xl bg-gradient-to-br from-primary-soft/60 via-card to-warm-soft/40 border border-border p-8 sm:p-12 space-y-8 shadow-card">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
              Child health data privacy by design
            </h2>
            <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
              We collect strictly minimal observations and provide plain-language, transparent control over your family's records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
              <h3 className="text-lg font-bold text-foreground">1. What we store</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Only the child's birth date (to calculate age in months) and your Yes/No screening responses. No biometric scans, GPS coordinates, or school identifiers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
              <h3 className="text-lg font-bold text-foreground">2. Who sees it</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Only you and clinicians you explicitly share reports with. We never sell data, never share with advertisers, and use no third-party tracking pixels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
              <h3 className="text-lg font-bold text-foreground">3. Delete anytime</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Under India's DPDP Act 2023 Right to Erasure, visiting our Privacy Center permanently and irreversibly destroys your account, answers, and evaluations.
              </p>
            </div>
          </div>

          {/* Published Scientific Citation Box */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-foreground-muted">
            <div className="space-y-1">
              <span className="font-bold text-foreground block">
                Published Clinical Instrument Structure:
              </span>
              <p className="leading-relaxed">
                Built around the published <strong>M-CHAT-R/F structure (16–30 months)</strong> by Robins, Casagrande, Barton, Chen, Dumont-Mathieu, &amp; Fein.
              </p>
            </div>
            <a
              href="https://pediatrics.aappublications.org/content/133/1/37"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted hover:bg-border text-foreground font-semibold text-sm transition-colors shrink-0"
            >
              <span>View Source (Pediatrics 2014)</span>
              <ExternalLink className="w-4 h-4 text-primary" />
            </a>
          </div>
        </div>
      </section>

      {/* ===================================================================
          6. FAQ ACCORDION (6-8 Questions, Accessible)
          =================================================================== */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed">
            Clear, honest answers about the screening instrument, scoring, and pediatric follow-up.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-2xl bg-card border border-border p-6 shadow-subtle transition-all open:ring-1 open:ring-primary/20"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
                <span>{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-foreground-muted transition-transform group-open:rotate-180 shrink-0 ml-4" />
              </summary>
              <p className="pt-4 text-base text-foreground-muted leading-relaxed border-t border-border/60 mt-4">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ===================================================================
          7. FINAL CTA BAND
          =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary text-white p-10 sm:p-16 text-center space-y-6 shadow-card relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-white leading-tight">
              Give yourself clarity about your toddler's milestones today.
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Takes 10 minutes. Completely confidential. Doctor-ready summary to take to your next pediatric appointment.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/screening"
              className="px-8 py-4 rounded-2xl bg-white text-primary font-bold text-base hover:bg-white/90 shadow-subtle transition-all min-h-[48px] flex items-center justify-center gap-2"
            >
              <span>Start free child screening</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/milestones"
              className="px-7 py-4 rounded-2xl bg-primary-hover border border-white/20 text-white font-semibold text-base hover:bg-primary-hover/80 transition-all min-h-[48px] flex items-center justify-center"
            >
              Explore milestones guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
