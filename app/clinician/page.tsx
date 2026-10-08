"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Search,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function ClinicianDashboard() {
  const [screenings, setScreenings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreening, setSelectedScreening] = useState<any | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [filterRisk, setFilterRisk] = useState<"ALL" | "MEDIUM" | "HIGH">("ALL");

  const fetchScreenings = async () => {
    try {
      const res = await fetch("/api/clinician/screenings");
      const data = await res.json();
      if (data.screenings) {
        setScreenings(data.screenings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenings();
  }, []);

  const handleSaveNote = async () => {
    if (!selectedScreening || !notesInput.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch("/api/clinician/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screeningId: selectedScreening.id,
          clinicianNotes: notesInput.trim(),
          doctorName: "Dr. Ananya Roy, MD",
        }),
      });
      if (res.ok) {
        await fetchScreenings();
        setSelectedScreening(null);
        setNotesInput("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  const filtered = screenings.filter((s) => {
    if (filterRisk === "ALL") return true;
    return s.riskLevel === filterRisk;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Clinician Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Developmental Specialist Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Clinician Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review parent-reported developmental screenings, triage risk likelihoods, and attach clinical guidance.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setFilterRisk("ALL")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg min-h-[36px] ${
              filterRisk === "ALL" ? "bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-sm" : ""
            }`}
          >
            All Screenings ({screenings.length})
          </button>
          <button
            onClick={() => setFilterRisk("MEDIUM")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg min-h-[36px] ${
              filterRisk === "MEDIUM" ? "bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-sm" : ""
            }`}
          >
            Medium Likelihood
          </button>
          <button
            onClick={() => setFilterRisk("HIGH")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg min-h-[36px] ${
              filterRisk === "HIGH" ? "bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-sm" : ""
            }`}
          >
            High Likelihood
          </button>
        </div>
      </div>

      {/* Screenings Table / Cards */}
      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading clinical queue...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          No screenings currently match this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Child: {item.childName}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.riskLevel === "LOW"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.riskLevel === "MEDIUM"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {item.riskLevel} Likelihood (Score: {item.totalScore})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>Instrument: {item.questionnaireId}</span>
                  <span>•</span>
                  <span>Evaluated: {new Date(item.completedAt || item.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Parent: {item.parentEmail}</span>
                </div>

                {/* Existing clinician notes if present */}
                {item.clinicianNotes && (
                  <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-100 dark:border-cyan-800 text-xs text-cyan-900 dark:text-cyan-200">
                    <strong>Clinician Notes:</strong> {item.clinicianNotes}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setSelectedScreening(item);
                    setNotesInput(item.clinicianNotes || "");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors min-h-[44px] flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{item.clinicianNotes ? "Edit Notes" : "Add Clinical Notes"}</span>
                </button>
                <Link
                  href={`/results/${item.id}`}
                  className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold transition-colors min-h-[44px] flex items-center gap-1"
                >
                  <span>Review Report</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes Modal */}
      {selectedScreening && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-600" />
                <span>Clinical Notes for {selectedScreening.childName}</span>
              </h3>
              <button
                onClick={() => setSelectedScreening(null)}
                className="text-slate-400 hover:text-slate-600 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <textarea
              rows={4}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Enter developmental observations, recommended specialist referrals, or advice..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedScreening(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingNote}
                onClick={handleSaveNote}
                className="w-1/2 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold min-h-[44px]"
              >
                {savingNote ? "Saving..." : "Save Clinical Notes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
