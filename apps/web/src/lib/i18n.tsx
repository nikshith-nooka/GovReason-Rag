"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "te";

export interface Translations {
  appName: string;
  appSubtitle: string;
  activeGrounding: string;
  navDashboard: string;
  navAssistant: string;
  navEligibility: string;
  navSchemes: string;
  navCompare: string;
  navTimeline: string;
  navEvaluation: string;
  selectLanguage: string;
  starterPrompt1: string;
  starterPrompt2: string;
  starterPrompt3: string;
  starterPrompt4: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "GovReasonRAG",
    appSubtitle: "Evidence-Contracted Policy Reasoning for Indian Public Schemes",
    activeGrounding: "Active Gazette Grounding",
    navDashboard: "Dashboard",
    navAssistant: "AI Assistant",
    navEligibility: "Eligibility Checker",
    navSchemes: "Scheme Explorer",
    navCompare: "Compare Policies",
    navTimeline: "Policy Timeline",
    navEvaluation: "Research Benchmarks",
    selectLanguage: "Language",
    starterPrompt1: "I am a 21-year-old engineering student from Telangana. Annual income ₹2.7 lakh. Which scholarships can I get?",
    starterPrompt2: "My father is 73 years old with high family income. Can he get Ayushman Bharat universal cover?",
    starterPrompt3: "I already get Telangana Rythu Bharosa. Am I also eligible for Central PM-KISAN ₹6,000 assistance?",
    starterPrompt4: "Can I install 3kW rooftop solar under PM Surya Ghar and still keep Gruha Jyothi 200 free units?"
  },
  hi: {
    appName: "GovReasonRAG",
    appSubtitle: "भारतीय सरकारी योजनाओं हेतु साक्ष्य-आधारित नीतिगत तर्क प्रणाली",
    activeGrounding: "सक्रिय राजपत्र सत्यापन",
    navDashboard: "डैशबोर्ड",
    navAssistant: "एआई सहायक",
    navEligibility: "पात्रता जाँच",
    navSchemes: "योजना अन्वेषक",
    navCompare: "योजना तुलना",
    navTimeline: "नीति समय-सीमा",
    navEvaluation: "अनुसंधान बेंचमार्क",
    selectLanguage: "भाषा",
    starterPrompt1: "मैं तेलंगाना से 21 वर्षीय इंजीनियरिंग छात्र हूँ। पारिवारिक आय ₹2.7 लाख है। मुझे कौन सी छात्रवृत्ति मिल सकती है?",
    starterPrompt2: "मेरे पिता 73 वर्ष के हैं। क्या उन्हें आयुष्मान भारत वरिष्ठ नागरिक स्वास्थ्य बीमा मिल सकता है?",
    starterPrompt3: "मुझे तेलंगाना रायथू भरोसा मिलता है। क्या मैं पीएम-किसान ₹6,000 सहायता हेतु भी पात्र हूँ?",
    starterPrompt4: "क्या मैं पीएम सूर्य घर योजना के साथ गृह ज्योति 200 यूनिट मुफ्त बिजली का लाभ भी ले सकता हूँ?"
  },
  te: {
    appName: "GovReasonRAG",
    appSubtitle: "భారతీయ ప్రభుత్వ పథకాల కోసం సాక్ష్య-ఆధారిత విధాన విశ్లేషణ",
    activeGrounding: "గెజిట్ ఆధారిత ప్రామాణికత",
    navDashboard: "డ్యాష్‌బోర్డ్",
    navAssistant: "AI అసిస్టెంట్",
    navEligibility: "అర్హత నిర్ధారణ",
    navSchemes: "పథకాల జాబితా",
    navCompare: "పథకాల పోలిక",
    navTimeline: "విధాన కాలక్రమం",
    navEvaluation: "పరిశోధన బెంచ్‌మార్క్‌లు",
    selectLanguage: "భాష",
    starterPrompt1: "నేను తెలంగాణకు చెందిన 21 సంవత్సరాల ఇంజనీరింగ్ విద్యార్థిని. వార్షిక ఆదాయం ₹2.7 లక్షలు. నాకు ఏ స్కాలర్‌షిప్‌లు వస్తాయి?",
    starterPrompt2: "మా నాన్నగారి వయస్సు 73 సంవత్సరాలు. ఆయనకు ఆయుష్మాన్ భారత్ ఉచిత ఆరోగ్య బీమా వర్తిస్తుందా?",
    starterPrompt3: "నాకు తెలంగాణ రైతు భరోసా వస్తోంది. నేను PM-కిసాన్ ₹6,000 సహాయాన్ని కూడా పొందవచ్చా?",
    starterPrompt4: "నేను PM సూర్య ఘర్ సోలార్ ప్యానెల్ పెడితే గృహజ్యోతి 200 యూనిట్ల ఉచిత విద్యుత్ రద్దవుతుందా?"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("govreasonrag_lang") as Language;
    if (saved && (saved === "en" || saved === "hi" || saved === "te")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("govreasonrag_lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
