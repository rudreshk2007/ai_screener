import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "EarlySteps | Early Autism Developmental Screening (Ages 12-48 Months)",
  description:
    "Gentle, pediatrician-aligned early autism screening tool for parents of children aged 12-48 months. Standardized M-CHAT-R/F instrument with DPDP Act 2023 parental privacy.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col selection:bg-cyan-200 selection:text-cyan-900">
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
