"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Lock, PhoneCall, HelpCircle, ExternalLink } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const showDemoLink = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Prominent Mandatory Clinical Disclaimer Box */}
        <div className="bg-slate-800/95 border border-teal-800/80 rounded-2xl p-6 text-slate-200 shadow-card">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-teal-900/60 text-teal-300 shrink-0 mt-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-base font-bold text-teal-200 uppercase tracking-wide">
                Medical & Clinical Disclaimer (Non-Diagnostic Instrument)
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                EarlySteps is an early developmental screening instrument designed to support parental observation
                and pediatric referral. <strong>It is NOT a diagnostic tool.</strong> Screening results never state
                that a child has autism spectrum disorder, nor can they rule out developmental delays. If you have
                questions or concerns regarding your child’s speech, eye contact, or social milestones, please schedule
                an evaluation with a qualified pediatrician, pediatric neurologist, or child developmental specialist.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-700 flex items-center justify-center text-white shadow-subtle">
                <Heart className="w-5 h-5 fill-white/20 stroke-white" />
              </div>
              <span className="text-xl font-bold font-heading text-white tracking-tight">EarlySteps</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Standardized, gentle developmental screening for ages 12–48 months, built with parental trust and strict DPDP Act 2023 data ethics.
            </p>
            <div className="flex items-center gap-2 text-sm text-teal-300 bg-teal-950/70 border border-teal-800/60 px-3.5 py-2 rounded-xl w-fit">
              <Lock className="w-4 h-4" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Quick Clinical Links */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">Clinical Screening</h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/screening" className="hover:text-teal-300 transition-colors">
                  Standardized M-CHAT-R (16–30m)
                </Link>
              </li>
              <li>
                <Link href="/milestones" className="hover:text-teal-300 transition-colors">
                  Milestones Tracker (12–48m)
                </Link>
              </li>
              <li>
                <Link href="/specialists" className="hover:text-teal-300 transition-colors">
                  Find a Pediatric Specialist
                </Link>
              </li>
              <li>
                <a
                  href="https://pediatrics.aappublications.org/content/133/1/37"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 transition-colors inline-flex items-center gap-1 text-slate-400"
                >
                  <span>M-CHAT-R/F Study (Robins 2014)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Rights */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">DPDP Parental Rights</h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/privacy" className="hover:text-teal-300 transition-colors">
                  Parental Consent Framework
                </Link>
              </li>
              <li>
                <Link href="/api/user/export-data" className="hover:text-teal-300 transition-colors">
                  Export My Health Data (JSON)
                </Link>
              </li>
              <li>
                <Link href="/privacy#delete" className="hover:text-rose-400 transition-colors">
                  Delete My Data Permanently
                </Link>
              </li>
              <li>
                <span className="text-sm text-slate-400 block">Zero advertising tracking cookies</span>
              </li>
            </ul>
          </div>

          {/* Support Helpline & Urgent Notice */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">Support & Assistance</h3>
            <div className="space-y-2.5 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Childline India: <strong className="text-white">1098</strong> (24x7)</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>NIMHANS Helpline: <strong className="text-white">080-46110007</strong></span>
              </div>
              <p className="text-sm text-amber-200/90 bg-amber-950/40 p-3 rounded-xl border border-amber-900/60 leading-relaxed mt-2">
                If you have urgent concerns regarding regression or physical distress, contact your pediatrician immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Demo Link */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} EarlySteps Pediatric Health. Standardized developmental screening.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-teal-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/privacy" className="hover:text-teal-300 transition-colors">
              DPDP Terms
            </Link>
            {/* Try Demo link shown ONLY when NEXT_PUBLIC_DEMO_MODE=true */}
            {showDemoLink && (
              <Link
                href="/dashboard"
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold px-2.5 py-1 rounded-lg bg-teal-950/60 border border-teal-800/60"
              >
                Try demo
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
