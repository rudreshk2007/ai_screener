"use client";

import React, { useState } from "react";
import { SPECIALIST_CENTERS } from "@/lib/specialists";
import { Stethoscope, MapPin, Phone, Star, ExternalLink, Search } from "lucide-react";

export default function SpecialistsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = SPECIALIST_CENTERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-xs font-semibold">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Vetted Pediatric Healthcare Centers</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Find a Developmental Pediatrician
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Connect with trusted multi-disciplinary developmental pediatric units across India.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search by city (e.g. Bangalore, Delhi, Mumbai) or clinic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:border-cyan-500 min-h-[44px]"
        />
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((center) => (
          <div
            key={center.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800">
                  {center.city}, {center.state}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{center.rating}</span>
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {center.name}
                </h2>
                <p className="text-xs text-cyan-700 dark:text-cyan-400 font-semibold mt-1">
                  {center.specialty}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{center.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{center.phone}</span>
                </div>
              </div>

              {/* Services tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {center.services.map((svc) => (
                  <span
                    key={svc}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px]"
                  >
                    {svc}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <a
                href={center.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors min-h-[44px]"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
