"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import {
  HeartHandshake,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  ShieldCheck,
  Stethoscope,
  Activity,
  Layers,
  MapPin,
  Lock,
  ChevronDown,
  Sparkles,
  User,
} from "lucide-react";

export function Navbar() {
  const { language, setLanguage, t, isDark, toggleTheme } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("PARENT");
  const pathname = usePathname();

  useEffect(() => {
    try {
      const user = localStorage.getItem("earlysteps_current_user");
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.role) setUserRole(parsed.role);
      }
    } catch {}
  }, [pathname]);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/dashboard", label: t.nav.dashboard },
    { href: "/milestones", label: t.nav.milestones, icon: Activity },
    { href: "/specialists", label: t.nav.specialists, icon: MapPin },
    { href: "/clinician", label: t.nav.clinician, icon: Stethoscope },
    { href: "/admin", label: t.nav.admin, icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
      {/* SaaS Clinical Disclaimer Ticker */}
      <div className="bg-gradient-to-r from-cyan-900 via-teal-900 to-cyan-950 text-cyan-100 text-[11px] sm:text-xs px-4 py-1.5 flex items-center justify-between font-medium shadow-inner">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-1.5 bg-cyan-800/80 px-2 py-0.5 rounded-full border border-cyan-600/50 text-[10px] uppercase font-bold tracking-wider text-cyan-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Screening Instrument
          </div>
          <span className="truncate text-cyan-100/90">
            EarlySteps is an early developmental screening tool, <strong>NOT a diagnosis</strong>. Always consult your pediatrician.
          </span>
          <div className="hidden md:flex items-center gap-1.5 ml-auto shrink-0 text-cyan-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>DPDP Act 2023 Verified</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none" aria-label="EarlySteps Home">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Early<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:to-teal-300">Steps</span>
              </span>
              <span className="text-[10px] block text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider -mt-1">
                Pediatric Screening (12–48m)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[38px] flex items-center gap-1.5 ${
                    active
                      ? "text-cyan-800 dark:text-cyan-200 bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700/50 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5 opacity-80" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right utility items: Language switcher, Dark Mode, Role Badge */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100/80 dark:bg-slate-900/80 rounded-xl p-1 border border-slate-200/80 dark:border-slate-800/80">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" aria-hidden="true" />
              {(["en", "hi", "mr"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors min-h-[30px] ${
                    language === l
                      ? "bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                  aria-label={`Switch language to ${l}`}
                >
                  {l === "en" ? "EN" : l === "hi" ? "हिन्दी" : "मराठी"}
                </button>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center bg-white/50 dark:bg-slate-900/50 shadow-sm"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* DPDP Privacy Badge */}
            <Link
              href="/privacy"
              className="px-2.5 py-2 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 flex items-center gap-1.5 min-h-[44px] shadow-sm transition-colors"
              title="Digital Personal Data Protection Act 2023 Compliant"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xl:inline">DPDP 2023</span>
            </Link>

            {/* SaaS Sign In / Dashboard CTA */}
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-700 to-teal-600 hover:from-cyan-800 hover:to-teal-700 text-white text-xs font-bold shadow-soft hover:shadow-md transition-all min-h-[44px] flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Portal Access</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-200 dark:border-slate-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-200 dark:border-slate-800"
              aria-label="Open mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2.5 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] flex items-center gap-2"
            >
              {link.icon && <link.icon className="w-4 h-4 text-cyan-600" />}
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Language:</span>
            <div className="flex gap-1">
              {(["en", "hi", "mr"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-3 py-1.5 text-xs rounded-lg min-h-[44px] ${
                    language === l ? "bg-cyan-700 text-white font-bold" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {l === "en" ? "EN" : l === "hi" ? "हिन्दी" : "मराठी"}
                </button>
              ))}
            </div>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 py-3 rounded-xl bg-cyan-700 text-white text-center font-bold block min-h-[44px] flex items-center justify-center shadow-soft"
          >
            Launch Parent Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
