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
  Heart,
  Search,
  Users,
  CheckCircle2,
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for Add Child
  const [childName, setChildName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "prefer_not_to_say">("prefer_not_to_say");
  const [isPremature, setIsPremature] = useState(false);
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(36);
  const [addingError, setAddingError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
      showToast(`Added ${childName.trim()} to family profiles.`);
      await fetchChildren();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving child";
      setAddingError(msg);
    }
  };

  const handleDeleteChild = async (childId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}'s profile and all associated screenings?`)) return;
    try {
      await fetch(`/api/children/${childId}`, { method: "DELETE" });
      showToast(`Removed ${name}'s profile.`);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-card flex items-center gap-3 border border-slate-700 animate-fade-in text-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-soft text-primary text-sm font-bold mb-2">
            <Heart className="w-4 h-4" />
            <span>Family Pediatric Overview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground tracking-tight">
            Parent Screening Dashboard
          </h1>
          <p className="text-base text-foreground-muted mt-1">
            Standardized developmental surveillance for toddlers aged 12 to 48 months.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-subtle hover:shadow-card transition-all flex items-center gap-2 min-h-[48px]"
            id="add-child-button"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Child Profile</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (4 items, calm styling, >=14px text) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-foreground-muted text-sm font-semibold">
            <span>Children Registered</span>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="text-3xl font-bold text-foreground block">{children.length}</span>
          <span className="text-sm text-foreground-muted block">Ages 12–48 months</span>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-foreground-muted text-sm font-semibold">
            <span>Completed Screenings</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-bold text-foreground block">{totalScreenings}</span>
          <span className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold block">M-CHAT-R/F Standard</span>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-foreground-muted text-sm font-semibold">
            <span>Age Bands</span>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span className="text-3xl font-bold text-foreground block">3 Bands</span>
          <span className="text-sm text-foreground-muted block">12–15m, 16–30m, 31–48m</span>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-foreground-muted text-sm font-semibold">
            <span>Privacy Protection</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-bold text-emerald-600">Active</span>
          <span className="text-sm text-foreground-muted block">DPDP Act 2023 Verified</span>
        </div>
      </div>

      {/* Children Section with Search */}
      <div id="children" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2">
            <Baby className="w-6 h-6 text-primary" />
            <span>Child Profiles ({children.length})</span>
          </h2>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search child by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border bg-card text-foreground min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-foreground-muted text-base">Loading child profiles...</div>
        ) : filteredChildren.length === 0 ? (
          /* Empty State */
          <div className="p-16 rounded-3xl bg-card border-2 border-dashed border-border text-center space-y-5 shadow-subtle">
            <div className="w-16 h-16 rounded-3xl bg-primary-soft text-primary mx-auto flex items-center justify-center">
              <Baby className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-bold text-foreground">No child profiles found</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Add your toddler's birth date to start their first standardized developmental screening.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-subtle hover:bg-primary-hover min-h-[48px]"
            >
              Add Child Profile Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChildren.map((child) => {
              const ageMonths = computeAgeMonths(child.dateOfBirth);
              const latestScreening = child.screenings?.[0];
              const advice = getRescreenAdvice(child);
              const stage = getAgeStage(ageMonths);

              return (
                <div
                  key={child.id}
                  className="rounded-3xl bg-card border border-border p-7 shadow-subtle card-hover flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header with Avatar & Details */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-13 h-13 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-bold text-xl">
                          {child.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{child.name}</h3>
                          <div className="flex items-center gap-2 text-sm mt-0.5">
                            <span className="font-semibold text-primary">
                              {ageMonths} months old
                            </span>
                            {child.isPremature && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                                Preterm ({child.gestationalWeeks || 34}w)
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-foreground-muted font-medium block mt-1">{stage}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteChild(child.id, child.name)}
                        className="text-foreground-muted hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title={`Delete profile for ${child.name}`}
                        aria-label={`Delete profile for ${child.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Re-screen Reminder Pill */}
                    <div className="p-4 rounded-2xl bg-muted border border-border/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-foreground flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary" /> Re-Screen Schedule
                        </span>
                        <span className="text-primary font-bold">{advice.badge}</span>
                      </div>
                      <p className="text-sm text-foreground-muted leading-relaxed">{advice.text}</p>
                    </div>

                    {/* Latest Screening Status */}
                    {latestScreening ? (
                      <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span className="text-foreground">Latest Screening</span>
                          {latestScreening.riskLevel === "LOW" && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              Low Likelihood
                            </span>
                          )}
                          {latestScreening.riskLevel === "MEDIUM" && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                              Medium Likelihood
                            </span>
                          )}
                          {latestScreening.riskLevel === "HIGH" && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900">
                              High Likelihood
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-foreground-muted pt-1 border-t border-border/60">
                          <span>{new Date(latestScreening.createdAt).toLocaleDateString()}</span>
                          <Link
                            href={`/results/${latestScreening.id}`}
                            className="text-primary font-bold hover:underline inline-flex items-center gap-1 text-sm min-h-[44px]"
                          >
                            <span>View Doctor Report & PDF</span>
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl border border-dashed border-border text-center space-y-1 text-sm text-foreground-muted">
                        <p>No screening on record yet</p>
                        <span className="text-xs text-primary font-semibold block">Takes ~10 minutes</span>
                      </div>
                    )}
                  </div>

                  {/* Start Screening Action */}
                  <div className="pt-2">
                    <Link
                      href={`/screening?childId=${child.id}`}
                      className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-subtle transition-all flex items-center justify-center gap-2 min-h-[48px]"
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
          <div className="bg-card rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-border shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                <Baby className="w-5 h-5 text-primary" />
                <span>Add Child Profile</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-foreground-muted hover:text-foreground p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </div>

            {addingError && (
              <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 text-sm border border-rose-200">
                {addingError}
              </div>
            )}

            <form onSubmit={handleAddChild} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="c-name">
                  Child's Name or Nickname *
                </label>
                <input
                  id="c-name"
                  type="text"
                  required
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Meera"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-base min-h-[48px] focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="c-dob">
                  Date of Birth (Calibrates age band) *
                </label>
                <input
                  id="c-dob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-base min-h-[48px] focus-visible:ring-2 focus-visible:ring-primary"
                />
                {dob && (
                  <p className="text-sm text-primary font-bold mt-1.5">
                    Calculated Age: {computeAgeMonths(dob)} months ({getAgeStage(computeAgeMonths(dob))})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="c-gender">
                  Gender (Optional)
                </label>
                <select
                  id="c-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "male" | "female" | "prefer_not_to_say")}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-base min-h-[48px] focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPremature}
                    onChange={(e) => setIsPremature(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-semibold text-foreground">
                    Born prematurely (before 37 weeks)?
                  </span>
                </label>
                {isPremature && (
                  <div className="mt-2.5 pl-6">
                    <label className="block text-sm text-foreground-muted mb-1" htmlFor="c-weeks">
                      Gestational Weeks (e.g. 34 weeks):
                    </label>
                    <input
                      id="c-weeks"
                      type="number"
                      min={24}
                      max={40}
                      value={gestationalWeeks}
                      onChange={(e) => setGestationalWeeks(Number(e.target.value))}
                      className="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[44px]"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-3 rounded-xl border border-border text-foreground font-semibold text-sm min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm min-h-[48px] shadow-subtle"
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
