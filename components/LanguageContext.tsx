"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, Translations } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isDark: boolean;
  toggleTheme: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("earlysteps_lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "hi" || savedLang === "mr")) {
      setLanguageState(savedLang);
    }
    const savedTheme = localStorage.getItem("earlysteps_theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("earlysteps_lang", lang);
  };

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("earlysteps_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("earlysteps_theme", "light");
      }
      return next;
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
