"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { ShieldCheck, Lock, UserCheck, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quick Demo Autofill handler
  const fillDemoAccount = (roleEmail: string, rolePass: string, defaultName?: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    if (defaultName) setName(defaultName);
    setConsentGiven(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && !consentGiven) {
      setError("Parental consent under the DPDP Act 2023 is required to create a screening account.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            agreedToDPDP: consentGiven,
            consentVersion: "1.0.0-dpdp2023",
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Signup failed");
        }
      }

      // Store demo user in localStorage for client session awareness
      localStorage.setItem(
        "earlysteps_current_user",
        JSON.stringify({
          email: email.trim(),
          name: name || (email.includes("doctor") ? "Dr. Ananya Roy" : "Priya Sharma"),
          role: email.includes("doctor") ? "CLINICIAN" : email.includes("admin") ? "ADMIN" : "PARENT",
        })
      );

      // Route according to role
      if (email.includes("doctor")) {
        router.push("/clinician");
      } else if (email.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Quick Demo Credentials Bar */}
        <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-cyan-900 dark:text-cyan-200">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>One-Click Demo Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("parent@earlysteps.org", "Parent@123", "Priya Sharma")}
              className="px-2 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-cyan-100 dark:hover:bg-cyan-900 text-slate-800 dark:text-slate-200 text-left transition-colors min-h-[44px]"
            >
              <strong className="block text-cyan-700 dark:text-cyan-400">Parent</strong>
              <span className="text-[10px] text-slate-500">Priya (3 kids)</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("doctor@earlysteps.org", "Doctor@123", "Dr. Ananya Roy")}
              className="px-2 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-cyan-100 dark:hover:bg-cyan-900 text-slate-800 dark:text-slate-200 text-left transition-colors min-h-[44px]"
            >
              <strong className="block text-cyan-700 dark:text-cyan-400">Clinician</strong>
              <span className="text-[10px] text-slate-500">Dr. Roy</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("admin@earlysteps.org", "Admin@123", "Admin")}
              className="px-2 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-cyan-100 dark:hover:bg-cyan-900 text-slate-800 dark:text-slate-200 text-left transition-colors min-h-[44px]"
            >
              <strong className="block text-cyan-700 dark:text-cyan-400">Admin</strong>
              <span className="text-[10px] text-slate-500">Metrics</span>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-card space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {mode === "login" ? "Sign In to EarlySteps" : "Parent Account & Consent"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mode === "login"
                ? "Access your children's developmental screenings and doctor reports"
                : "Secure, confidential screening aligned with India's DPDP Act 2023"}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition-colors min-h-[40px] ${
                mode === "login"
                  ? "bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition-colors min-h-[40px] ${
                mode === "signup"
                  ? "bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="name">
                  Parent or Guardian Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-cyan-500 min-h-[44px]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@earlysteps.org"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-cyan-500 min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-cyan-500 min-h-[44px]"
              />
            </div>

            {/* Plain-Language DPDP Act 2023 Consent Screen (Always visible during signup) */}
            {mode === "signup" && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
                  <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Verifiable Consent Notice (DPDP Act 2023 • v1.0.0)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  We process only the observational answers you provide to compute developmental risk likelihoods. You
                  retain the legal right to export your data or delete your account at any time.
                </p>
                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    id="consent-checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-cyan-600 focus:ring-cyan-500 shrink-0"
                  />
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                    I confirm I am the parent/legal guardian and give verifiable consent for developmental screening.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-sm shadow-soft transition-colors min-h-[48px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In & Continue" : "Agree & Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <div className="pt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
            By continuing, you acknowledge that EarlySteps is a screening tool and does not provide medical diagnoses.
          </div>
        </div>
      </div>
    </div>
  );
}
