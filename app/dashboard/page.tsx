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
  Activity,
  HeartPulse,
  TrendingUp,
  Search,
  Users,
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
  const [searchTerm, setSearchTerm] = useState("");

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

  const getAgeStage = (ageMonths: number) => {
    if (ageMonths < 16) return "Infant Stage (12–15m)";
    if (ageMonths <= 30) return "Toddler Stage (16–30m)";
    return "Preschool Stage (31–48m)";
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

  const filteredChildren = children.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalScreenings = children.reduce(
    (acc, c) => acc + (c.screenings?.length || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* SaaS Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-xs font-bold mb-2">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Family Health Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Parent Screening Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor standardized developmental surveillance milestones for children aged 12 to 48 months.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-700 to-teal-600 hover:from-cyan-800 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-soft hover:shadow-md transition-all flex items-center gap-2 min-h-[44px]"
            id="add-child-button"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Child Profile</span>
          </button>
        </div>
      </div>

      {/* SaaS Executive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Children Registered</span>
            <Users className="w-4 h-4 text-cyan-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{children.length}</span>
          <span className="text-[11px] text-slate-400 block font-medium">Ages 12–48 months</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Completed Screenings</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{totalScreenings}</span>
          <span className="text-[11px] text-emerald-600 font-semibold block">M-CHAT-R/F Standard</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Clinical Protocols</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">3 Bands</span>
          <span className="text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold block">12-15m, 16-30m, 31-48m</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Data Privacy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600">Active</span>
          <span className="text-[11px] text-slate-400 block font-medium">DPDP Act 2023 Verified</span>
        </div>
      </div>

      {/* Children Section with Search Bar */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Baby className="w-5 h-5 text-cyan-600" />
            <span>Child Profiles ({children.length})</span>
          </h2>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search child by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white min-h-[38px]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading child profiles...</div>
        ) : filteredChildren.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 mx-auto flex items-center justify-center">
              <Baby className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Children Profiles Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Add your child's profile to establish their standardized screening age band.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-cyan-700 text-white font-bold text-xs min-h-[44px]"
            >
              Add Child Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChildren.map((child) => {
              const ageMonths = computeAgeMonths(child.dateOfBirth);
              const advice = getRescreenAdvice(child);
              const latestScreening = child.screenings?.[0];
              const stage = getAgeStage(ageMonths);

              return (
                <div
                  key={child.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-card hover:shadow-xl transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group"
                >
                  <div className="space-y-4">
                    {/* Header with Avatar & Details */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-soft">
                          {child.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{child.name}</h3>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-cyan-700 dark:text-cyan-300">
                              {ageMonths} months old
                            </span>
                            {child.isPremature && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                                Preterm ({child.gestationalWeeks || 34}w)
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{stage}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteChild(child.id)}
                        className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                        title="Delete Child Profile"
                        aria-label={`Delete ${child.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Re-screen Reminder Pill */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-cyan-600" /> Re-Screen Schedule
                        </span>
                        <span className="text-cyan-700 dark:text-cyan-400">{advice.badge}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{advice.text}</p>
                    </div>

                    {/* Past Screening Status */}
                    {latestScreening ? (
                      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 space-y-2 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Latest Screening
                          </span>
                          {latestScreening.riskLevel === "LOW" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Low Risk
                            </span>
                          )}
                          {latestScreening.riskLevel === "MEDIUM" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Medium Risk
                            </span>
                          )}
                          {latestScreening.riskLevel === "HIGH" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> High Risk
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between font-medium">
                          <span>Total Score: <strong>{latestScreening.totalScore}/20</strong></span>
                          <span>{new Date(latestScreening.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Link
                          href={`/results/${latestScreening.id}`}
                          className="text-xs font-bold text-cyan-700 dark:text-cyan-300 hover:underline flex items-center gap-1 pt-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Doctor Report &amp; PDF</span>
                          <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                        </Link>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-cyan-50/40 dark:bg-slate-850 border border-dashed border-cyan-200 dark:border-slate-700 text-center text-xs text-slate-500">
                        No screening recorded yet for {child.name}.
                      </div>
                    )}
                  </div>

                  {/* Start Screening Action Button */}
                  <div className="pt-2">
                    <Link
                      href={`/screening?childId=${child.id}`}
                      className="w-full py-3 px-4 rounded-2xl bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold text-xs shadow-soft transition-all flex items-center justify-center gap-1.5 min-h-[46px]"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm min-h-[44px]"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm min-h-[44px]"
                />
                {dob && (
                  <p className="text-[11px] text-cyan-700 dark:text-cyan-300 font-bold mt-1">
                    Calculated Age: {computeAgeMonths(dob)} months ({getAgeStage(computeAgeMonths(dob))})
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm min-h-[44px]"
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
                      className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs min-h-[36px]"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs min-h-[44px] shadow-soft"
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
