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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-soft text-primary text-sm font-bold">
          <Stethoscope className="w-4 h-4" />
          <span>Vetted Pediatric Healthcare Centers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
          Find a Developmental Pediatrician
        </h1>
        <p className="text-base text-foreground-muted leading-relaxed">
          Connect with trusted multi-disciplinary developmental pediatric units across India for formal diagnostic consultations.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-5 h-5 text-foreground-muted absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search by city (e.g. Bangalore, Delhi, Mumbai)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-base text-foreground focus-visible:ring-2 focus-visible:ring-primary min-h-[48px]"
        />
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((center) => (
          <div
            key={center.id}
            className="p-7 rounded-3xl bg-card border border-border shadow-subtle flex flex-col justify-between space-y-5 card-hover"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-soft text-primary border border-primary/20">
                  {center.city}, {center.state}
                </span>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{center.rating}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold font-heading text-foreground">{center.name}</h2>
              <p className="text-sm font-semibold text-primary">{center.specialty}</p>

              <div className="space-y-2 text-sm text-foreground-muted pt-2 border-t border-border/80">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{center.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>{center.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={center.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl border border-border hover:bg-muted text-foreground font-bold text-sm flex items-center justify-center gap-2 transition-colors min-h-[48px]"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-4 h-4 text-primary" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
