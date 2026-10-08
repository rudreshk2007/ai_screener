"use client";

import React, { useState } from "react";
import { MILESTONES_DATA } from "@/lib/milestones";
import { Activity, Sparkles, HeartHandshake, CheckCircle2, ChevronRight } from "lucide-react";

export default function MilestonesPage() {
  const [selectedAge, setSelectedAge] = useState<number>(18);

  const ages = [12, 18, 24, 36, 48];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>Pediatric Developmental Milestones (12–48 Months)</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Milestone Tracker &amp; Observation Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Track social communication, speech, eye contact, and cooperative play with calm sensory tips.
        </p>
      </div>

      {/* Age selector tabs */}
      <div className="flex justify-center gap-2 overflow-x-auto pb-2">
        {ages.map((age) => (
          <button
            key={age}
            type="button"
            onClick={() => setSelectedAge(age)}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center gap-1.5 ${
              selectedAge === age
                ? "bg-cyan-700 text-white shadow-soft"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            <span>{age} Months</span>
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MILESTONES_DATA.map((cat) => {
          const matched = cat.milestones.find((m) => m.ageMonths === selectedAge);
          if (!matched) return null;

          return (
            <div
              key={cat.category}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>{cat.category}</span>
                </h2>
                <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950 px-2.5 py-0.5 rounded-full">
                  {selectedAge}m
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{matched.behavior}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {matched.description}
                </p>
              </div>

              {/* Sensory & Play Tip */}
              <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-teal-700 dark:text-teal-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Sensory-Friendly Play Tip
                </span>
                <p className="leading-relaxed">{matched.sensoryTip}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
