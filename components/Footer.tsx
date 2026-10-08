"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Lock, PhoneCall, HelpCircle } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prominent Mandatory Clinical Disclaimer Box */}
        <div className="bg-slate-800/90 border border-cyan-800/60 rounded-2xl p-5 mb-10 text-slate-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-900/50 text-cyan-300 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-cyan-200 uppercase tracking-wide">
                Medical & Clinical Disclaimer (Non-Diagnostic Instrument)
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                EarlySteps is an early developmental screening instrument designed to support parental observation
                and pediatric referral. <strong>It is NOT a diagnostic tool.</strong> Screening results never state
                that a child has autism spectrum disorder, nor can they rule out developmental delays. If you have
                questions or concerns regarding your child’s speech, eye contact, or social milestones, please schedule
                an evaluation with a qualified pediatrician, pediatric neurologist, or child developmental specialist.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EarlySteps</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Standardized, gentle developmental screening for ages 12–48 months, built with parental trust and data
              ethics.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <Lock className="w-3.5 h-3.5" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-semibold text-white mb-3">Clinical Screening</h2>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/screening" className="hover:text-cyan-400 transition-colors">
                  Standardized M-CHAT-R (16-30m)
                </Link>
              </li>
              <li>
                <Link href="/milestones" className="hover:text-cyan-400 transition-colors">
                  Milestones Tracker (12-48m)
                </Link>
              </li>
              <li>
                <Link href="/specialists" className="hover:text-cyan-400 transition-colors">
                  Find a Pediatric Specialist
                </Link>
              </li>
              <li>
                <Link href="/clinician" className="hover:text-cyan-400 transition-colors">
                  Clinician Review Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Rights */}
          <div>
            <h2 className="text-sm font-semibold text-white mb-3">DPDP Parental Rights</h2>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Parental Consent Framework
                </Link>
              </li>
              <li>
                <Link href="/api/user/export-data" className="hover:text-cyan-400 transition-colors">
                  Export My Health Data (JSON)
                </Link>
              </li>
              <li>
                <Link href="/privacy#delete" className="hover:text-rose-400 transition-colors">
                  Delete My Data Permanently
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-slate-500 block mt-1">Data Minimization Principle applied</span>
              </li>
            </ul>
          </div>

          {/* Support Helpline */}
          <div>
            <h2 className="text-sm font-semibold text-white mb-3">Support & Guidance</h2>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                <span>Childline India: <strong>1098</strong> (24x7)</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>NIMHANS Helpline: <strong>080-46110007</strong></span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                For developmental emergencies or regression, contact your pediatrician immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>© {new Date().getFullYear()} EarlySteps Health. Built strictly for developmental screening.</div>
          <div>M-CHAT-R/F citation: Robins et al., Pediatrics 2014.</div>
        </div>
      </div>
    </footer>
  );
}
