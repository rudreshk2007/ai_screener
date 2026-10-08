"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import {
  Heart,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  ChevronDown,
  Check,
  User,
  LogOut,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export function Navbar() {
  const { language, setLanguage, t, isDark, toggleTheme } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Check auth state & scroll position
  useEffect(() => {
    try {
      const stored = localStorage.getItem("earlysteps_current_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("earlysteps_current_user");
    setCurrentUser(null);
    window.location.href = "/";
  };

  // Determine Nav links based strictly on auth role
  const isAuth = !!currentUser;
  const role = currentUser?.role || "PARENT";

  const publicLinks = [
    { href: "/#how-it-works", label: "How it works" },
    { href: "/milestones", label: "Milestones" },
    { href: "/specialists", label: "Find specialists" },
    { href: "/#faq", label: "FAQ" },
  ];

  const loggedInLinks =
    role === "CLINICIAN"
      ? [
          { href: "/clinician", label: "Clinician View" },
          { href: "/milestones", label: "Milestones" },
          { href: "/specialists", label: "Specialists" },
          { href: "/privacy", label: "Privacy" },
        ]
      : role === "ADMIN"
      ? [
          { href: "/admin", label: "Admin Console" },
          { href: "/dashboard", label: "Dashboard" },
          { href: "/milestones", label: "Milestones" },
          { href: "/privacy", label: "Privacy" },
        ]
      : [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard#children", label: "Children" },
          { href: "/milestones", label: "Milestones" },
          { href: "/privacy", label: "Account" },
        ];

  const linksToRender = isAuth ? loggedInLinks : publicLinks;

  const languages = [
    { code: "en", label: "English", short: "EN" },
    { code: "hi", label: "हिन्दी", short: "HI" },
    { code: "mr", label: "मराठी", short: "MR" },
  ] as const;

  const activeLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-50 w-full transition-shadow duration-200">
      {/* 1. Slim Top Notice: 14px+, dismissible */}
      {!noticeDismissed && (
        <aside
          aria-label="Clinical screening notice"
          className="bg-primary text-white text-sm px-4 py-2 flex items-center justify-between border-b border-primary-hover shadow-subtle"
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warm shrink-0" aria-hidden="true" />
              <span>
                <strong>A screening tool, not a diagnosis.</strong> Always consult your pediatrician for developmental evaluations.
              </span>
            </div>
            <button
              onClick={() => setNoticeDismissed(true)}
              className="text-white/80 hover:text-white p-1 rounded-md min-h-[32px] min-w-[32px] flex items-center justify-center shrink-0"
              aria-label="Dismiss screening notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Main Navigation Bar */}
      <nav
        className={`w-full bg-background/95 backdrop-blur-md border-b border-border transition-all ${
          scrolled ? "shadow-subtle" : ""
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo: gentle warm pediatric identity */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1"
              aria-label="EarlySteps Home"
            >
              <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-subtle group-hover:bg-primary-hover transition-colors">
                <Heart className="w-6 h-6 fill-white/20 stroke-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-foreground">
                  Early<span className="text-primary">Steps</span>
                </span>
                <span className="text-sm text-foreground-muted font-medium -mt-1">
                  Pediatric Screening (12–48m)
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Max 5 items, strictly role-based) */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-1">
                {linksToRender.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3.5 py-2 rounded-xl text-base font-medium transition-colors min-h-[44px] flex items-center ${
                        active
                          ? "text-primary bg-primary-soft font-bold"
                          : "text-foreground-muted hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Utility Actions: Language Dropdown + Theme Toggle + CTA */}
              <div className="flex items-center gap-3 pl-2 border-l border-border">
                {/* Single Language Dropdown */}
                <div className="relative" ref={langDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-sm font-semibold text-foreground min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Current language: ${activeLangObj.label}. Click to switch.`}
                    aria-expanded={langDropdownOpen}
                  >
                    <Globe className="w-4 h-4 text-primary" />
                    <span>{activeLangObj.short}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-foreground-muted transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {langDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 rounded-xl bg-card border border-border shadow-card py-1.5 z-50">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            setLanguage(l.code);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-muted transition-colors ${
                            language === l.code ? "font-bold text-primary bg-primary-soft" : "text-foreground font-medium"
                          }`}
                        >
                          <span>{l.label}</span>
                          {language === l.code && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dark Mode Toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground-muted hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
                </button>

                {/* Auth CTA or User Menu */}
                {isAuth ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard"
                      className="px-4 py-2.5 rounded-xl bg-primary-soft text-primary hover:bg-primary/20 text-sm font-bold min-h-[44px] flex items-center gap-1.5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="max-w-[120px] truncate">{currentUser?.name?.split(" ")[0] || "Account"}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 rounded-xl text-foreground-muted hover:text-risk-high hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Log out"
                      aria-label="Log out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/screening"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-base font-bold shadow-subtle hover:shadow-card transition-all min-h-[48px] flex items-center justify-center"
                  >
                    Start screening
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl border border-border bg-card text-foreground min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Sheet Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-auto bottom-0 h-[calc(100vh-5rem)] bg-background border-t border-border p-6 flex flex-col justify-between overflow-y-auto z-50">
            <div className="space-y-4">
              <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                {isAuth ? `Logged In (${role})` : "Explore EarlySteps"}
              </span>
              <div className="flex flex-col space-y-1">
                {linksToRender.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3.5 rounded-xl text-lg font-semibold text-foreground hover:bg-muted transition-colors min-h-[48px] flex items-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Language Selection in Mobile Sheet */}
              <div className="pt-4 border-t border-border">
                <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider block mb-2">
                  Language / भाषा
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`py-3 px-2 rounded-xl text-sm font-bold border min-h-[48px] ${
                        language === l.code
                          ? "bg-primary text-white border-primary"
                          : "bg-card text-foreground border-border"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-3">
              {isAuth ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 rounded-xl border border-border text-foreground font-bold text-base min-h-[48px]"
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    href="/screening"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base text-center block shadow-card min-h-[48px]"
                  >
                    Start free screening
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl border border-border text-foreground font-semibold text-sm text-center block min-h-[48px]"
                  >
                    Sign in to existing profile
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
