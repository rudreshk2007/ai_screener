"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export function Navbar() {
  const { language, setLanguage, t, isDark, toggleTheme } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/dashboard", label: t.nav.dashboard },
    { href: "/milestones", label: t.nav.milestones, icon: Activity },
    { href: "/specialists", label: t.nav.specialists, icon: MapPin },
    { href: "/clinician", label: t.nav.clinician, icon: Stethoscope },
    { href: "/admin", label: t.nav.admin, icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Clinical Screening Banner */}
      <div className="bg-cyan-900 text-cyan-50 text-xs px-4 py-1.5 flex items-center justify-between font-medium">
        <div className="flex items-center gap-1.5 max-w-5xl mx-auto w-full">
          <ShieldCheck className="w-4 h-4 text-cyan-300 shrink-0" />
          <span className="truncate">
            <span className="font-semibold uppercase tracking-wider text-cyan-200">Screening Tool:</span>{" "}
            EarlySteps is an early developmental screening tool, NOT a clinical diagnosis. Always consult a pediatrician.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 focus:outline-none" aria-label="EarlySteps Home">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-soft">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Early<span className="text-cyan-600 dark:text-cyan-400">Steps</span>
              </span>
              <span className="text-[10px] block text-slate-500 dark:text-slate-400 font-medium -mt-1">
                Pediatric Screening (12-48m)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center gap-1.5 ${
                    active
                      ? "text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4 opacity-80" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right utility items: Language switcher, Dark Mode, Demo Logins */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <Globe className="w-4 h-4 text-slate-500 ml-1.5 mr-1" aria-hidden="true" />
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 text-xs font-semibold rounded min-h-[36px] ${
                  language === "en"
                    ? "bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                aria-label="Switch language to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2 py-1 text-xs font-semibold rounded min-h-[36px] ${
                  language === "hi"
                    ? "bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                aria-label="Switch language to Hindi"
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage("mr")}
                className={`px-2 py-1 text-xs font-semibold rounded min-h-[36px] ${
                  language === "mr"
                    ? "bg-white dark:bg-slate-700 text-cyan-700 dark:text-cyan-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                aria-label="Switch language to Marathi"
              >
                मराठी
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* DPDP Privacy Badge link */}
            <Link
              href="/privacy"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center gap-1 min-h-[44px]"
              title="Digital Personal Data Protection Act 2023 Compliant"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">DPDP 2023</span>
            </Link>

            {/* Quick Login / Sign In */}
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white text-sm font-semibold shadow-sm transition-colors min-h-[44px] flex items-center"
            >
              {t.nav.login}
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] flex items-center"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Language:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 text-xs rounded min-h-[44px] ${
                  language === "en" ? "bg-cyan-700 text-white font-bold" : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-3 py-1.5 text-xs rounded min-h-[44px] ${
                  language === "hi" ? "bg-cyan-700 text-white font-bold" : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage("mr")}
                className={`px-3 py-1.5 text-xs rounded min-h-[44px] ${
                  language === "mr" ? "bg-cyan-700 text-white font-bold" : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                मराठी
              </button>
            </div>
          </div>
          <Link
            href="/auth/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 py-2.5 rounded-lg bg-cyan-700 text-white text-center font-medium block min-h-[44px] flex items-center justify-center"
          >
            {t.nav.login}
          </Link>
        </div>
      )}
    </header>
  );
}
