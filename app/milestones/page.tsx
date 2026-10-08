"use client";

import React, { useState } from "react";
import { MILESTONES_DATA } from "@/lib/milestones";
import { Activity, Sparkles, CheckCircle2, ChevronRight, Heart } from "lucide-react";

export default function MilestonesPage() {
  const [selectedAge, setSelectedAge] = useState<number>(18);

  const ages = [12, 18, 24, 36, 48];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-soft text-primary text-sm font-bold">
          <Activity className="w-4 h-4" />
          <span>Pediatric Developmental Milestones (12–48 Months)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
          Milestone Tracker &amp; Observation Guide
        </h1>
        <p className="text-base text-foreground-muted leading-relaxed">
          Observe social communication, speech, eye contact, and cooperative play with calm sensory tips.
        </p>
      </div>

      {/* Age selector tabs */}
      <div className="flex justify-center gap-3 overflow-x-auto pb-2" role="tablist">
        {ages.map((age) => (
          <button
            key={age}
            type="button"
            role="tab"
            aria-selected={selectedAge === age}
            onClick={() => setSelectedAge(age)}
            className={`px-6 py-3 rounded-2xl text-sm sm:text-base font-bold transition-all min-h-[48px] flex items-center gap-2 ${
              selectedAge === age
                ? "bg-primary text-white shadow-subtle"
                : "bg-card border border-border text-foreground hover:bg-muted"
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
              className="p-7 rounded-3xl bg-card border border-border shadow-subtle space-y-5 card-hover"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{cat.category}</span>
                </h2>
                <span className="text-sm font-bold text-primary px-3 py-1 bg-primary-soft rounded-full">
                  {selectedAge}m Milestone
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                  Typical Milestone Behavior
                </span>
                <p className="text-base text-foreground font-bold leading-relaxed">
                  {matched.behavior}
                </p>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {matched.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted border border-border space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gentle Parent Observation Activity</span>
                </div>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {matched.sensoryTip}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
