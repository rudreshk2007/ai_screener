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
  ExternalLink,
  ChevronRight,
  Printer,
  CheckCircle2,
  FileCheck,
  Share2,
  Copy,
  Info,
  Check,
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
  const [showShareModal, setShowShareModal] = useState(false);

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
        <div className="w-12 h-12 border-4 border-cyan-200 dark:border-cyan-900 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-bold">
          Calibrating standardized clinical evaluation...
        </p>
      </div>
    );
  }

  if (!data || !data.screening) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Screening Record Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested evaluation report is unavailable or has been archived.
        </p>
        <Link href="/dashboard" className="px-5 py-2.5 bg-cyan-700 text-white rounded-xl text-xs font-semibold inline-block">
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
  const scorePercent = Math.min(100, Math.max(0, (totalScore / maxScore) * 100));

  // Get matching threshold metadata
  const thresholdMeta = config.riskThresholds.find((th: any) => th.level === riskLevel) || {
    label: `${riskLevel} likelihood of needing further evaluation`,
    summary: screening.result?.summary || "Evaluation summary unavailable.",
    color: riskLevel === "LOW" ? "emerald" : riskLevel === "MEDIUM" ? "amber" : "rose",
    badge: `${riskLevel} Risk`,
  };

  // Copy clinician brief to clipboard
  const handleCopySummary = () => {
    const summaryText = `EarlySteps Screening Report\nChild: ${child.name} (DOB: ${new Date(child.dateOfBirth).toLocaleDateString()})\nInstrument: ${config.name}\nScore: ${totalScore}/${maxScore}\nClassification: ${thresholdMeta.label}\nSummary: ${thresholdMeta.summary}\nNext Steps:\n${recommendations.map((r: string) => "- " + r).join("\n")}\n\nNotice: Non-diagnostic screening instrument. Recommended consultation with developmental pediatrician.`;
    navigator.clipboard.writeText(summaryText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Generate PDF function for Pediatrician consultation
  const generateDoctorPdf = () => {
    setDownloadingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header
      doc.setFillColor(8, 145, 178); // Teal
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
      doc.setTextColor(15, 23, 42);
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
      doc.setFillColor(riskLevel === "LOW" ? 236 : riskLevel === "MEDIUM" ? 254 : 255, riskLevel === "LOW" ? 253 : riskLevel === "MEDIUM" ? 243 : 228, riskLevel === "LOW" ? 245 : riskLevel === "MEDIUM" ? 199 : 230);
      doc.rect(14, 70, 182, 24, "F");

      doc.setTextColor(riskLevel === "LOW" ? 5 : riskLevel === "MEDIUM" ? 180 : 190, riskLevel === "LOW" ? 150 : riskLevel === "MEDIUM" ? 83 : 18, riskLevel === "LOW" ? 105 : riskLevel === "MEDIUM" ? 9 : 60);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`Classification: ${thresholdMeta.label}`, 18, 78);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text(`Total Risk Score: ${screening.totalScore} / ${config.questions.length} points (${thresholdMeta.badge})`, 18, 85);
      doc.text(`Summary: ${thresholdMeta.summary}`, 18, 91);

      // Section 3: Recommended Clinical Actions
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("3. Recommended Clinical Follow-up", 14, 102);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let yOffset = 108;
      recommendations.forEach((rec: string, idx: number) => {
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

      // Critical Medical Disclaimer Footer (Mandatory Rule #1)
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 268, 182, 22, "F");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "bold");
      doc.text("MANDATORY CLINICAL NOTICE: THIS IS A SCREENING TOOL, NOT A DIAGNOSIS.", 18, 273);
      doc.setFont("helvetica", "normal");
      doc.text(
        "A positive screening score does not confirm autism; a negative score does not exclude it. Always discuss with a pediatrician.",
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
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* 1. MANDATORY CLINICAL SCREENING DISCLAIMER (RULE #1) */}
      <div
        role="alert"
        className="p-5 rounded-3xl bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-300/80 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-2 shadow-soft backdrop-blur-sm"
      >
        <div className="flex items-center gap-2.5 font-bold text-sm tracking-wide uppercase">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Screening Tool Only — Not a Medical Diagnosis</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/90">
          EarlySteps is an early developmental screening instrument, <strong>NOT a diagnostic evaluation</strong>. A
          screening score does not confirm an autism spectrum diagnosis, nor does it replace comprehensive clinical
          evaluation. Always share these findings with a qualified developmental pediatrician or specialist.
        </p>
      </div>

      {/* 2. Main Result Summary Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-9 border border-slate-200/90 dark:border-slate-700/90 shadow-card space-y-8">
        {/* Child Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-soft">
              <Baby className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {child.name}'s Evaluation
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800">
                  {config.shortName}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluated on {new Date(screening.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })} • Protocol v{config.version || "1.0"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold text-xs flex items-center gap-1.5 transition-colors min-h-[44px]"
              title="Copy summary for doctor email"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copiedLink ? "Copied!" : "Copy Brief"}</span>
            </button>

            <button
              type="button"
              onClick={generateDoctorPdf}
              disabled={downloadingPdf}
              className="px-4 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-soft transition-all flex items-center justify-center gap-2 min-h-[44px]"
              id="download-pdf-btn"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingPdf ? "Generating PDF..." : "Download PDF Report"}</span>
            </button>
          </div>
        </div>

        {/* 3. Classification Card: Color + Icon + Text (NEVER color alone) */}
        <div
          className={`p-6 sm:p-7 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all ${
            riskLevel === "LOW"
              ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-sm"
              : riskLevel === "MEDIUM"
              ? "bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100 shadow-sm"
              : "bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100 shadow-sm"
          }`}
          id="risk-classification-box"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              {riskLevel === "LOW" && <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              {riskLevel === "MEDIUM" && <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400 shrink-0" />}
              {riskLevel === "HIGH" && <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0" />}
              <span className="text-lg sm:text-xl font-extrabold tracking-tight">
                {thresholdMeta.label}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed">
              {thresholdMeta.summary}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-black/5 dark:border-white/5">
            <span className="text-3xl sm:text-4xl font-black block tracking-tight">
              {screening.totalScore}
              <span className="text-xs text-slate-500 font-normal"> / {maxScore} pts</span>
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                riskLevel === "LOW"
                  ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200"
                  : riskLevel === "MEDIUM"
                  ? "bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200"
                  : "bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200"
              }`}
            >
              {thresholdMeta.badge}
            </span>
          </div>
        </div>

        {/* 4. Interactive Visual Risk Barometer / Thermometer Dial */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Standardized M-CHAT-R/F Risk Scale
            </span>
            <span className="text-slate-500 font-medium">Child score: {totalScore} of {maxScore}</span>
          </div>

          {/* Barometer Track */}
          <div className="relative pt-6 pb-2">
            {/* Score Marker Needle */}
            <div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-700 pointer-events-none z-10"
              style={{ left: `${Math.min(95, Math.max(5, scorePercent))}%` }}
            >
              <span className="bg-slate-900 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                Score {totalScore}
              </span>
              <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
            </div>

            {/* Gradient Segmented Bar */}
            <div className="grid grid-cols-3 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="bg-emerald-500" title="Low Likelihood (0-2 pts)"></div>
              <div className="bg-amber-500" title="Medium Likelihood (3-7 pts)"></div>
              <div className="bg-rose-500" title="High Likelihood (8-20 pts)"></div>
            </div>

            {/* Scale Legends */}
            <div className="grid grid-cols-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-2 text-center">
              <div>Low Likelihood (0-2)</div>
              <div>Medium Likelihood (3-7)</div>
              <div>High Likelihood (8-20)</div>
            </div>
          </div>
        </div>

        {/* 5. Actionable Next Steps */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-cyan-600" />
            <span>Recommended Clinical Next Steps</span>
          </h2>

          <div className="space-y-2.5">
            {recommendations.map((rec: string, index: number) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="leading-relaxed font-medium">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Itemized Breakdown */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-cyan-600" />
              <span>Observation Breakdown ({screening.answers.length} Responses)</span>
            </h2>
            <span className="text-xs text-slate-400">
              {screening.answers.filter((a: any) => a.scoreValue > 0).length} items flagged
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden max-h-80 overflow-y-auto">
            {screening.answers.map((ans: any) => {
              const q = config.questions.find((x: any) => x.id === ans.questionId);
              const isRisk = ans.scoreValue > 0;
              return (
                <div key={ans.id} className="p-3.5 flex items-center justify-between text-xs gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-750/50 transition-colors">
                  <div className="space-y-0.5 max-w-lg">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Q{ans.questionId} • {q?.category || "Observation"}
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {q?.text || `Question #${ans.questionId}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        isRisk
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
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

        {/* Action Buttons: Specialist & Dashboard */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
          <Link
            href="/specialists"
            className="flex-1 py-3.5 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs sm:text-sm text-center shadow-soft transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Find a Developmental Specialist</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm text-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center justify-center min-h-[44px]"
          >
            <span>Back to Parent Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
