# EarlySteps: Pediatric Early Autism Screening Platform (Ages 12–48 Months)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Tested%20with-Playwright-green?logo=playwright)](https://playwright.dev/)
[![Compliance](https://img.shields.io/badge/DPDP%20Act%202023-Compliant-emerald)](#india-dpdp-act-2023-compliance)

**EarlySteps** is a gentle, science-backed, pediatric developmental screening web application designed for parents of children aged **12 to 48 months**.

Built in accordance with the `ui-ux-pro-max` design intelligence for calm, sensory-friendly pediatric healthcare, WCAG 2.2 AA accessibility, and India's Digital Personal Data Protection (DPDP) Act 2023 principles.

---

## ⚠️ Critical Medical Notice
> **EarlySteps is a SCREENING tool, NOT a diagnostic assessment.**
> Results indicate whether a child may benefit from further professional evaluation. It never states "your child has autism", but strictly classifies risk as:
> **"Low / Medium / High likelihood of needing further evaluation"**.
> Always consult a qualified pediatrician, pediatric neurologist, or child developmental specialist.

---

## 🌟 Key Features

### Frontend (Parent Experience)
- **Calm, Sensory-Friendly UI**: Soft oceanic teal and mindful emerald color palette designed to avoid overstimulation.
- **Mobile-First & Accessible**: Designed from 360px up with touch targets $\ge 44\text{px}$ (answer buttons styled at $56\text{px}$).
- **Standardized Questionnaires**:
  - `M-CHAT-R/F (16–30 months)`: Full 20 standardized questions with concrete everyday examples for parents and video-guide placeholders.
  - `12–15 months` & `31–48 months`: Marked with `"Requires clinician-approved content"` placeholder banners.
- **One Question Per Screen**: Streamlined mobile question view with dynamic progress bar, previous/next controls, and instant auto-save.
- **Doctor-Ready PDF Report**: Client-side pediatric summary generated via jsPDF for sharing directly during clinical consultations.
- **Developmental Milestones Tracker**: Multi-domain milestone tracker (Speech, Eye Contact, Pointing, Play) for 12, 18, 24, 36, and 48 months with sensory play tips.
- **Find a Specialist Directory**: Vetted developmental centers (AIIMS, NIMHANS, KEM, Manipal, Rainbow, Apollo) with direct Google Maps navigation links.
- **Multi-Language Support**: Seamless language switcher supporting English, हिन्दी (Hindi), and मराठी (Marathi).
- **Dark Mode & Reduced Motion**: Full system-preferred and toggleable dark theme.

### Backend & Privacy (DPDP Act 2023)
- **Verifiable Parental Consent**: Mandatory versioned consent notice (`v1.0.0-dpdp2023`) recorded with timestamps, user-agent, and IP address.
- **Data Minimization**: Collects only child nickname/name, birth date (for automatic age-band calculation), and premature birth parameters. Zero biometric tracking.
- **Right to Portability**: `/api/user/export-data` endpoint to download complete health records in authenticated JSON format.
- **Right to Erasure ("Delete-My-Data")**: `/api/user/delete-data` endpoint that cascades and permanently wipes user accounts, children, screenings, answers, and clinical notes.
- **Clinician Review Queue**: Specialized portal for developmental pediatricians to triage flagged screenings and record structured clinical notes.
- **Admin Governance & Anonymized Stats**: Anonymized metrics panel monitoring screening volume and DPDP audit trails with zero Personally Identifiable Information (PII) in logs.

---

## 🚀 Quick Start

Run everything with a single command:

```bash
npm run dev
```

This single command will:
1. Verify and automatically initialize the database with seed data:
   - **Demo Parent**: `parent@earlysteps.org` / `Parent@123` (Pre-seeded with 3 children: Aarav 14m, Meera 24m with completed Medium-Risk screening, Kabir 40m preterm).
   - **Demo Clinician**: `doctor@earlysteps.org` / `Doctor@123`
   - **System Admin**: `admin@earlysteps.org` / `Admin@123`
2. Launch the Next.js development server at **http://localhost:3000**.

---

## 🧪 Testing & Verification

```bash
# 1. Run pure scoring engine unit tests
npm run test:unit

# 2. Run end-to-end user journey test (Playwright)
# (Landing -> Signup -> Consent -> Add Child -> Questionnaire -> Result -> PDF -> Delete Account)
npm run test:e2e

# 3. Run automated Axe WCAG 2.2 AA accessibility audit
npx playwright test tests/a11y-axe.spec.ts

# 4. Refresh responsive screenshots (375px, 768px, 1440px + dark mode)
npm run test:screenshots
```

---

## 📁 Project Architecture

```
├── app/                      # Next.js 14 App Router routes & layouts
│   ├── api/                  # API endpoints (Auth, Children, Screening, Clinician, Admin, DPDP)
│   ├── auth/login/           # Parent login/signup & DPDP consent screen
│   ├── dashboard/            # Parent dashboard (children, re-screen schedule, add child)
│   ├── screening/            # One-question-per-screen questionnaire flow
│   ├── results/[id]/         # Result classification, next steps & PDF export
│   ├── milestones/           # 12-48m developmental milestone tracker
│   ├── specialists/          # Vetted specialist clinics & Google Maps links
│   ├── clinician/            # Specialist triage & clinical notes portal
│   ├── admin/                # Governance metrics & sanitized audit log
│   └── privacy/              # DPDP Act 2023 parental rights center
├── config/screening/         # Questionnaire JSON definitions (M-CHAT-R/F & Placeholders)
├── components/               # Navbar, Footer, LanguageContext, Theme toggles
├── lib/                      # Scoring engine, config loader, database client, audit logger
├── screenshots/              # 40 full-page responsive screenshots across 3 viewports & dark mode
├── scripts/                  # Seed script & unit test runners
└── tests/                    # Playwright E2E and Axe accessibility test suites
```

---

## 📜 Citations & Clinical References

- Robins, D. L., Casagrande, K., Barton, M., Chen, C. M., Dumont-Mathieu, T., & Fein, D. (2014). *Validation of the modified checklist for autism in toddlers, revised with follow-up (M-CHAT-R/F)*. **Pediatrics**, 133(1), 37-45.
- Government of India (2023). *The Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)*. Ministry of Law and Justice.
