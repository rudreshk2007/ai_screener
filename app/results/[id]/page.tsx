"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { jsPDF } from "jspdf";
import { useLanguage } from "@/components/LanguageContext";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Download,
  Calendar,
  Baby,
  Stethoscope,
  ArrowRight,
  Printer,
  CheckCircle2,
  FileCheck,
  Copy,
  Check,
  Info,
  Sparkles,
} from "lucide-react";

export default function ResultPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const screeningId = params.id as string;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadResult() {
      try {
        const res = await fetch(`/api/screening/${screeningId}`);
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [screeningId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-base text-foreground font-bold">
          Calibrating standardized clinical evaluation...
        </p>
      </div>
    );
  }

  if (!data || !data.screening) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-5">
        <h2 className="text-2xl font-bold text-foreground">Screening Record Not Found</h2>
        <p className="text-sm text-foreground-muted">
          The requested evaluation report is unavailable or has been archived.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold inline-block"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { screening, config, recommendations } = data;
  const child = screening.child;
  const riskLevel = screening.riskLevel as "LOW" | "MEDIUM" | "HIGH";
  const totalScore = screening.totalScore ?? 0;
  const maxScore = config.questions.length || 20;

  // Get matching threshold metadata
  const thresholdMeta = config.riskThresholds.find((th: any) => th.level === riskLevel) || {
    label: `${riskLevel} likelihood of needing further evaluation`,
    summary: screening.result?.summary || "Evaluation summary unavailable.",
    badge: `${riskLevel} Risk`,
  };

  // Copy clinician brief to clipboard
  const handleCopySummary = () => {
    const summaryText = `EarlySteps Screening Report\nChild: ${child.name} (DOB: ${new Date(child.dateOfBirth).toLocaleDateString()})\nInstrument: ${config.name}\nClassification: ${thresholdMeta.label}\nSummary: ${thresholdMeta.summary}\nNext Steps:\n${recommendations.map((r: string) => "- " + r).join("\n")}\n\nNotice: Non-diagnostic screening instrument. Recommended consultation with developmental pediatrician.`;
    navigator.clipboard.writeText(summaryText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Generate PDF report for Doctor consultation
  const generateDoctorPdf = () => {
    setDownloadingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header
      doc.setFillColor(13, 92, 99); // Teal
      doc.rect(0, 0, 210, 24, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("EarlySteps: Pediatric Developmental Screening Report", 14, 15);

      // Subheader / Disclaimer Banner
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Standardized Pediatric Observation Summary • Non-Diagnostic Screener", 14, 21);

      // Section 1: Child & Screening Information
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("1. Child & Screening Demographics", 14, 34);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const dobFormatted = new Date(child.dateOfBirth).toLocaleDateString();
      const screeningDate = new Date(screening.completedAt || screening.createdAt).toLocaleDateString();

      doc.text(`Child Name / Identifier: ${child.name}`, 14, 42);
      doc.text(`Date of Birth: ${dobFormatted}`, 14, 48);
      doc.text(`Premature Birth: ${child.isPremature ? `Yes (${child.gestationalWeeks || 34} weeks)` : "No"}`, 14, 54);
      doc.text(`Instrument: ${config.name} (${config.shortName})`, 110, 42);
      doc.text(`Evaluation Date: ${screeningDate}`, 110, 48);
      doc.text(`Report ID: ${screening.id}`, 110, 54);

      // Horizontal separator
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 58, 196, 58);

      // Section 2: Screening Classification & Likelihood
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("2. Screening Result & Clinical Likelihood", 14, 66);

      // Highlight Box
      doc.setFillColor(riskLevel === "LOW" ? 234 : riskLevel === "MEDIUM" ? 254 : 255, riskLevel === "LOW" ? 247 : riskLevel === "MEDIUM" ? 243 : 241, riskLevel === "LOW" ? 241 : riskLevel === "MEDIUM" ? 199 : 242);
      doc.rect(14, 70, 182, 24, "F");

      doc.setTextColor(riskLevel === "LOW" ? 13 : riskLevel === "MEDIUM" ? 180 : 190, riskLevel === "LOW" ? 122 : riskLevel === "MEDIUM" ? 83 : 18, riskLevel === "LOW" ? 85 : riskLevel === "MEDIUM" ? 9 : 60);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`Classification: ${thresholdMeta.label}`, 18, 78);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text(`Observation Placement: ${thresholdMeta.badge}`, 18, 85);
      doc.text(`Summary: ${thresholdMeta.summary}`, 18, 91);

      // Section 3: Recommended Clinical Actions
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("3. Recommended Clinical Follow-up", 14, 102);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let yOffset = 108;
      recommendations.forEach((rec: string) => {
        doc.text(`• ${rec}`, 18, yOffset);
        yOffset += 6;
      });

      // Section 4: Itemized Observations
      yOffset += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("4. Itemized Parent Responses", 14, yOffset);
      yOffset += 6;

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      screening.answers.slice(0, 14).forEach((ans: any) => {
        const qObj = config.questions.find((q: any) => q.id === ans.questionId);
        if (qObj && yOffset < 265) {
          const isRisk = ans.scoreValue > 0;
          const statusText = isRisk ? "[Risk Indicated]" : "[Typical]";
          doc.text(`Q${ans.questionId}: ${qObj.text.substring(0, 65)}... -> ${ans.response} ${statusText}`, 14, yOffset);
          yOffset += 5;
        }
      });

      // Mandatory Clinical Disclaimer Footer
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 268, 182, 22, "F");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "bold");
      doc.text("MANDATORY CLINICAL NOTICE: THIS IS A SCREENING TOOL, NOT A DIAGNOSIS.", 18, 273);
      doc.setFont("helvetica", "normal");
      doc.text(
        "A screening score does not confirm autism; a typical score does not exclude it. Always discuss with a pediatrician.",
        18,
        278
      );
      doc.text(
        "Standardized source: Robins et al., Pediatrics (2014) M-CHAT-R/F. India DPDP Act 2023 compliant data minimization.",
        18,
        283
      );

      doc.save(`EarlySteps-Screening-${child.name.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 space-y-8">
      {/* 1. MANDATORY CLINICAL SCREENING DISCLAIMER (RULE #1) - PINNED VISIBLY */}
      <div
        role="alert"
        className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-2 shadow-subtle"
      >
        <div className="flex items-center gap-2.5 font-bold text-base tracking-wide uppercase">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Screening Tool Only — Not a Medical Diagnosis</span>
        </div>
        <p className="text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/90">
          EarlySteps is an early developmental screening instrument, <strong>NOT a diagnostic evaluation</strong>. A
          screening score does not confirm an autism spectrum diagnosis, nor does it replace comprehensive clinical
          evaluation. Always share these findings with a qualified developmental pediatrician or specialist.
        </p>
      </div>

      {/* 2. Main Result Evaluation Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-10 border border-border shadow-card space-y-8">
        {/* Child Header & Doctor Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-bold text-2xl shadow-subtle">
              <Baby className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
                  Observations for {child.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-primary-soft text-primary border border-primary/20">
                  {config.shortName}
                </span>
              </div>
              <p className="text-sm text-foreground-muted mt-0.5">
                Evaluated on {new Date(screening.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-semibold text-sm flex items-center gap-2 min-h-[48px] transition-colors"
              title="Copy brief summary for doctor notes"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-foreground-muted" />}
              <span>{copiedLink ? "Copied!" : "Copy Brief"}</span>
            </button>

            <button
              type="button"
              onClick={generateDoctorPdf}
              disabled={downloadingPdf}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-subtle transition-all flex items-center justify-center gap-2 min-h-[48px]"
              id="download-pdf-btn"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingPdf ? "Generating PDF..." : "Share with your doctor (PDF)"}</span>
            </button>
          </div>
        </div>

        {/* 3. Risk Summary Card: Headline is Likelihood (NEVER raw score alone) */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all ${
            riskLevel === "LOW"
              ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
              : riskLevel === "MEDIUM"
              ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100"
              : "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100"
          }`}
          id="risk-classification-box"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {riskLevel === "LOW" && <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              {riskLevel === "MEDIUM" && <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400 shrink-0" />}
              {riskLevel === "HIGH" && <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0" />}
              {/* NEVER raw score as headline; headline is the likelihood label */}
              <h2 className="text-xl sm:text-2xl font-bold font-heading tracking-tight">
                {thresholdMeta.label}
              </h2>
            </div>
            <p className="text-base leading-relaxed max-w-xl">
              {thresholdMeta.summary}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-card p-4 rounded-xl border border-border">
            <span className="text-xs uppercase font-bold text-foreground-muted block">
              Observed Indicators
            </span>
            <span className="text-lg font-bold text-foreground block mt-0.5">
              {totalScore} of {maxScore} flagged
            </span>
            <span
              className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold mt-1 ${
                riskLevel === "LOW"
                  ? "bg-emerald-100 text-emerald-900"
                  : riskLevel === "MEDIUM"
                  ? "bg-amber-100 text-amber-900"
                  : "bg-rose-100 text-rose-900"
              }`}
            >
              {thresholdMeta.badge}
            </span>
          </div>
        </div>

        {/* 4. Actionable "What to do next" Checklist */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            <span>What to do next: Pediatrician Consultation Checklist</span>
          </h2>

          <div className="space-y-3">
            {recommendations.map((rec: string, index: number) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-muted border border-border text-base text-foreground flex items-start gap-3.5"
              >
                <div className="w-7 h-7 rounded-lg bg-primary-soft text-primary flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Itemized Breakdown */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              <span>Observation Breakdown ({screening.answers.length} Responses)</span>
            </h2>
            <span className="text-sm text-foreground-muted">
              {screening.answers.filter((a: any) => a.scoreValue > 0).length} items flagged for discussion
            </span>
          </div>

          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden max-h-80 overflow-y-auto bg-card">
            {screening.answers.map((ans: any) => {
              const q = config.questions.find((x: any) => x.id === ans.questionId);
              const isRisk = ans.scoreValue > 0;
              return (
                <div key={ans.id} className="p-4 flex items-center justify-between text-sm gap-4 hover:bg-muted/50 transition-colors">
                  <div className="space-y-0.5 max-w-lg">
                    <span className="text-xs text-foreground-muted font-bold block uppercase">
                      Q{ans.questionId} • {q?.category || "Observation"}
                    </span>
                    <p className="text-foreground font-medium">
                      {q?.text || `Question #${ans.questionId}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        isRisk
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                      }`}
                    >
                      {ans.response} {isRisk ? "• Follow-up" : "• Typical"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation CTAs: Specialist & Dashboard */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
          <Link
            href="/specialists"
            className="flex-1 py-3.5 px-5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base text-center shadow-subtle transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Find a Developmental Specialist</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 py-3.5 px-5 rounded-xl border border-border text-foreground font-bold text-base text-center hover:bg-muted transition-colors flex items-center justify-center min-h-[48px]"
          >
            <span>Back to Parent Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
