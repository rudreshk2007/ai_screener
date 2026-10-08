"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import {
  Baby,
  PlusCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  Sparkles,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";

interface ScreeningItem {
  id: string;
  childId: string;
  questionnaireId: string;
  status: string;
  totalScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | null;
  createdAt: string;
  completedAt: string | null;
}

interface ChildItem {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string | null;
  isPremature: boolean;
  gestationalWeeks: number | null;
  screenings?: ScreeningItem[];
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [children, setChildren] = useState<ChildItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for Add Child
  const [childName, setChildName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "prefer_not_to_say">("prefer_not_to_say");
  const [isPremature, setIsPremature] = useState(false);
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(36);
  const [addingError, setAddingError] = useState<string | null>(null);

  // Calculate age in months
  const computeAgeMonths = (dateStr: string) => {
    const birth = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.4375));
    return Math.max(0, diff);
  };

  const fetchChildren = async () => {
    try {
      const res = await fetch("/api/children");
      const data = await res.json();
      if (res.ok && data.children) {
        setChildren(data.children);
      }
    } catch (err) {
      console.error("Error fetching children:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingError(null);

    if (!childName.trim() || !dob) {
      setAddingError("Please provide child name/nickname and date of birth.");
      return;
    }

    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: childName.trim(),
          dateOfBirth: new Date(dob).toISOString(),
          gender,
          isPremature,
          gestationalWeeks: isPremature ? Number(gestationalWeeks) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add child profile");
      }
      setShowAddModal(false);
      setChildName("");
      setDob("");
      setIsPremature(false);
      await fetchChildren();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving child";
      setAddingError(msg);
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!confirm("Are you sure you want to delete this child's profile and screening history?")) return;
    try {
      await fetch(`/api/children/${childId}`, { method: "DELETE" });
      await fetchChildren();
    } catch (err) {
      console.error(err);
    }
  };

  // Re-screening schedule recommendation based on age and previous score
  const getRescreenAdvice = (child: ChildItem) => {
    const age = computeAgeMonths(child.dateOfBirth);
    const latestScreening = child.screenings?.[0];

    if (!latestScreening) {
      return {
        badge: "Screening Due",
        text: `Recommended now for age ${age} months.`,
        actionable: true,
      };
    }

    if (latestScreening.riskLevel === "HIGH" || latestScreening.riskLevel === "MEDIUM") {
      return {
        badge: "Specialist Follow-up",
        text: "Consult pediatrician with report; re-evaluate in 3 months.",
        actionable: false,
      };
    }

    if (age < 24) {
      return {
        badge: "Milestone Re-screen",
        text: "Next routine screening recommended at 24 months.",
        actionable: true,
      };
    }

    return {
      badge: "Routine Check",
      text: "Re-screen every 6 months or if new concerns arise.",
      actionable: true,
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Parent Screening Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and monitor developmental milestones for children aged 12 to 48 months.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs sm:text-sm shadow-soft transition-colors flex items-center gap-2 min-h-[44px]"
            id="add-child-button"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Child Profile</span>
          </button>
        </div>
      </div>

      {/* Children Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Baby className="w-5 h-5 text-cyan-600" />
            <span>Registered Children ({children.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading child profiles...</div>
        ) : children.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 mx-auto flex items-center justify-center">
              <Baby className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Children Added Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Add your child's name and date of birth to match the exact standardized developmental age band.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-cyan-700 text-white font-semibold text-xs min-h-[44px]"
            >
              Add Child Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => {
              const ageMonths = computeAgeMonths(child.dateOfBirth);
              const advice = getRescreenAdvice(child);
              const latestScreening = child.screenings?.[0];

              return (
                <div
                  key={child.id}
                  className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-card hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header with Child Details */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-lg border border-cyan-100 dark:border-cyan-800">
                          {child.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{child.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-cyan-700 dark:text-cyan-300">
                              {ageMonths} months old
                            </span>
                            {child.isPremature && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">
                                Preterm ({child.gestationalWeeks || 34}w)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteChild(child.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors min-h-[36px]"
                        title="Delete Child Profile"
                        aria-label={`Delete ${child.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Re-screen Reminder Pill */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-600" /> Re-Screen Schedule
                        </span>
                        <span className="text-cyan-700 dark:text-cyan-400">{advice.badge}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{advice.text}</p>
                    </div>

                    {/* Past Screening Status */}
                    {latestScreening ? (
                      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Latest Screening
                          </span>
                          {latestScreening.riskLevel === "LOW" && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Low Risk
                            </span>
                          )}
                          {latestScreening.riskLevel === "MEDIUM" && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Medium Risk
                            </span>
                          )}
                          {latestScreening.riskLevel === "HIGH" && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> High Risk
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
                          <span>Total Score: {latestScreening.totalScore}</span>
                          <span>{new Date(latestScreening.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Link
                          href={`/results/${latestScreening.id}`}
                          className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:underline flex items-center gap-1 pt-1"
                        >
                          <span>View Doctor Report &amp; PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-cyan-50/50 dark:bg-slate-900 border border-dashed border-cyan-200 dark:border-slate-700 text-center text-xs text-slate-500">
                        No screening recorded yet for {child.name}.
                      </div>
                    )}
                  </div>

                  {/* Start Screening Action */}
                  <div className="pt-2">
                    <Link
                      href={`/screening?childId=${child.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <span>
                        {latestScreening ? "Start New Screening" : `Screen ${child.name} (${ageMonths}m)`}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Baby className="w-5 h-5 text-cyan-600" />
                <span>Add Child Profile</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {addingError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
                {addingError}
              </div>
            )}

            <form onSubmit={handleAddChild} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="c-name">
                  Child's Name or Nickname *
                </label>
                <input
                  id="c-name"
                  type="text"
                  required
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Meera"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="c-dob">
                  Date of Birth (Determines exact age band) *
                </label>
                <input
                  id="c-dob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm min-h-[44px]"
                />
                {dob && (
                  <p className="text-[11px] text-cyan-700 dark:text-cyan-300 font-semibold mt-1">
                    Calculated age: {computeAgeMonths(dob)} months
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="c-gender">
                  Gender (Optional)
                </label>
                <select
                  id="c-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "male" | "female" | "prefer_not_to_say")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm min-h-[44px]"
                >
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPremature}
                    onChange={(e) => setIsPremature(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Born prematurely (before 37 weeks)?
                  </span>
                </label>
                {isPremature && (
                  <div className="mt-2 pl-6">
                    <label className="block text-[11px] text-slate-500 mb-1" htmlFor="c-weeks">
                      Gestational Weeks (e.g. 34 weeks):
                    </label>
                    <input
                      id="c-weeks"
                      type="number"
                      min={24}
                      max={40}
                      value={gestationalWeeks}
                      onChange={(e) => setGestationalWeeks(Number(e.target.value))}
                      className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs min-h-[36px]"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs min-h-[44px]"
                  id="save-child-btn"
                >
                  Save Child Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
