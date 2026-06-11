"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/translations";

interface InclusivityContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  easyMode: boolean;
  setEasyMode: (mode: boolean) => void;
  t: (key: keyof typeof translations.en) => string;
}

const InclusivityContext = createContext<InclusivityContextType | undefined>(undefined);

export function InclusivityProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [easyMode, setEasyMode] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("predinex_lang") as Language;
    const savedEasy = localStorage.getItem("predinex_easy_mode") === "true";
    if (savedLang) setLanguage(savedLang);
    if (savedEasy) setEasyMode(savedEasy);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("predinex_lang", lang);
  };

  const handleSetEasyMode = (mode: boolean) => {
    setEasyMode(mode);
    localStorage.setItem("predinex_easy_mode", String(mode));
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key] || String(key);
  };

  return (
    <InclusivityContext.Provider 
      value={{ 
        language, 
        setLanguage: handleSetLanguage, 
        easyMode, 
        setEasyMode: handleSetEasyMode,
        t 
      }}
    >
      {children}
    </InclusivityContext.Provider>
  );
}

export function useInclusivity() {
  const context = useContext(InclusivityContext);
  if (context === undefined) {
    throw new Error("useInclusivity must be used within an InclusivityProvider");
  }
  return context;
}
