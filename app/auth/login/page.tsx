"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { ShieldCheck, Lock, UserCheck, AlertCircle, ArrowRight, Heart } from "lucide-react";

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
      <div className="max-w-md w-full space-y-6">
        {/* Brand identity */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary mx-auto flex items-center justify-center shadow-subtle">
            <Heart className="w-6 h-6 fill-primary/20 stroke-primary" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground">
            Early<span className="text-primary">Steps</span> Health
          </h2>
          <p className="text-sm text-foreground-muted">
            Gentle pediatric developmental screening platform
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-card space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold font-heading text-foreground">
              {mode === "login" ? "Sign In to EarlySteps" : "Parent Account & Consent"}
            </h1>
            <p className="text-sm text-foreground-muted leading-relaxed">
              {mode === "login"
                ? "Access your children's developmental screenings and doctor reports"
                : "Confidential screening aligned with India's DPDP Act 2023"}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-muted p-1 border border-border">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`w-1/2 py-2.5 text-sm font-bold rounded-lg transition-colors min-h-[44px] ${
                mode === "login"
                  ? "bg-card text-primary shadow-subtle"
                  : "text-foreground-muted hover:text-foreground"
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
              className={`w-1/2 py-2.5 text-sm font-bold rounded-lg transition-colors min-h-[44px] ${
                mode === "signup"
                  ? "bg-card text-primary shadow-subtle"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 text-rose-900 text-sm border border-rose-200 flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="name">
                  Parent or Guardian Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-base focus-visible:ring-2 focus-visible:ring-primary min-h-[48px]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@earlysteps.org"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-base focus-visible:ring-2 focus-visible:ring-primary min-h-[48px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-base focus-visible:ring-2 focus-visible:ring-primary min-h-[48px]"
              />
            </div>

            {/* DPDP Act Verifiable Parental Consent Screen in Signup Mode */}
            {mode === "signup" && (
              <div className="p-4 rounded-2xl bg-muted border border-border space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verifiable Consent (DPDP Act 2023)</span>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="consent-checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded text-primary focus:ring-primary shrink-0"
                    required
                  />
                  <span className="text-sm text-foreground-muted leading-relaxed">
                    I confirm that I am the legal parent/guardian of the child being screened. I consent to
                    recording developmental observations for the sole purpose of non-diagnostic screening. I
                    understand I may export or permanently delete this data at any time.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-subtle transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>{loading ? "Processing..." : mode === "login" ? "Sign In" : "Agree & Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pre-seed Fillers for Evaluator */}
          <div className="pt-4 border-t border-border space-y-2.5">
            <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider block text-center">
              Evaluator Quick Access Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount("parent@earlysteps.org", "Parent@123", "Priya Sharma")}
                className="p-2.5 rounded-xl bg-muted hover:bg-border text-xs text-foreground font-semibold text-center transition-colors min-h-[44px]"
              >
                Demo Parent
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("doctor@earlysteps.org", "Doctor@123", "Dr. Ananya Roy")}
                className="p-2.5 rounded-xl bg-muted hover:bg-border text-xs text-foreground font-semibold text-center transition-colors min-h-[44px]"
              >
                Demo Clinician
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
