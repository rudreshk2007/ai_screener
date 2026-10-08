"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { Lock, Download, Trash2, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function PrivacyPage() {
  const { t } = useLanguage();

  const [deleteEmail, setDeleteEmail] = useState("parent@earlysteps.org");
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Are you absolutely sure? This will permanently delete your account, all children profiles, screening answers, and results.")) {
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      const res = await fetch("/api/user/delete-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: deleteEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete data");

      setDeleteSuccess(data.message || "All personal data, children profiles, screenings, and results have been permanently erased.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting data";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-sm font-semibold">
          <Lock className="w-4 h-4" />
          <span>India DPDP Act 2023 Compliance Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
          Child Health Data Privacy &amp; Parental Rights
        </h1>
        <p className="text-base text-foreground-muted leading-relaxed">
          Complete transparency and sovereign parental control over your family's developmental screening records.
        </p>
      </div>

      {/* 4 Pillars of DPDP Act */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 rounded-3xl bg-card border border-border shadow-subtle space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>1. Verifiable Parental Consent</span>
          </div>
          <p className="text-base text-foreground-muted leading-relaxed">
            Prior to collecting any developmental observations, parents provide explicit, informed consent. Consent records are versioned with timestamps and security audits.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-card border border-border shadow-subtle space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>2. Strict Data Minimization</span>
          </div>
          <p className="text-base text-foreground-muted leading-relaxed">
            We only collect the child's birth date (to establish the developmental age band) and Yes/No responses. No biometric data, GPS location tracking, or third-party cookies are used.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-card border border-border shadow-subtle space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>3. Right to Data Portability</span>
          </div>
          <p className="text-base text-foreground-muted leading-relaxed">
            You can export your complete health screening file at any moment in open, machine-readable JSON format to share directly with pediatricians or hospital EHRs.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-card border border-border shadow-subtle space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>4. Right to Erasure ("Delete-My-Data")</span>
          </div>
          <p className="text-base text-foreground-muted leading-relaxed">
            Exercising your right to erasure immediately cascades across the database, deleting user accounts, children, screenings, and clinical notes with zero lingering records.
          </p>
        </div>
      </div>

      {/* Action 1: Export Data */}
      <div className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            <span>Export Your Health Data (JSON)</span>
          </h2>
          <p className="text-sm text-foreground-muted">
            Download an authenticated copy of all children profiles, consents, answers, and evaluations.
          </p>
        </div>
        <a
          href="/api/user/export-data?email=parent@earlysteps.org"
          download
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-subtle transition-colors min-h-[48px] flex items-center justify-center gap-2 shrink-0"
          id="export-data-btn"
        >
          <Download className="w-4 h-4" />
          <span>Download Export Package</span>
        </a>
      </div>

      {/* Action 2: Delete Data */}
      <div
        id="delete"
        className="bg-rose-50/60 dark:bg-rose-950/30 rounded-3xl p-7 sm:p-9 border-2 border-rose-200 dark:border-rose-900/60 shadow-subtle space-y-5"
      >
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-heading text-rose-950 dark:text-rose-200 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-600" />
            <span>Permanent Erasure: "Delete-My-Data"</span>
          </h2>
          <p className="text-sm text-rose-900/90 dark:text-rose-300">
            Under India's DPDP Act 2023, you can request immediate and irreversible destruction of all your family's records.
          </p>
        </div>

        {deleteSuccess && (
          <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-sm border border-emerald-300 font-medium">
            {deleteSuccess}
          </div>
        )}
        {deleteError && (
          <div className="p-4 rounded-xl bg-rose-100 text-rose-900 text-sm border border-rose-300 font-medium">
            {deleteError}
          </div>
        )}

        <form onSubmit={handleDelete} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={deleteEmail}
            onChange={(e) => setDeleteEmail(e.target.value)}
            placeholder="parent@earlysteps.org"
            className="flex-1 px-4 py-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-card text-base text-foreground min-h-[48px] focus-visible:ring-2 focus-visible:ring-rose-500"
            required
            id="delete-email-input"
          />
          <button
            type="submit"
            disabled={deleting}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-subtle transition-colors min-h-[48px] shrink-0"
            id="confirm-delete-btn"
          >
            {deleting ? "Erasing..." : "Permanently Erase My Data"}
          </button>
        </form>
      </div>
    </div>
  );
}
