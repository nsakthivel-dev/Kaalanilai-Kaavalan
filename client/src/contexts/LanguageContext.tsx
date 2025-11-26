import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "en" | "hi" | "sw" | "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.diagnose": "Diagnose",
    "nav.library": "Crop Library",
    "nav.chat": "AI Assistant",
    "nav.dashboard": "Dashboard",
    "nav.experts": "Experts",
    "nav.alerts": "Alerts",
    "nav.download": "Download App",
    "nav.contact": "Contact",
    "hero.title": "Detect Crop Problems Early",
    "hero.subtitle": "Simple, Safe, Reliable",
    "hero.cta": "Upload Leaf Photo",
    "feature.offline": "Works Offline",
    "feature.safe": "Safe Advice",
    "feature.guidelines": "FAO-ICAR Guidelines",
  },
  hi: {
    "nav.home": "होम",
    "nav.diagnose": "निदान",
    "nav.library": "फसल पुस्तकालय",
    "nav.chat": "एआई सहायक",
    "nav.dashboard": "डैशबोर्ड",
    "nav.experts": "विशेषज्ञ",
    "nav.alerts": "अलर्ट",
    "nav.download": "ऐप डाउनलोड",
    "nav.contact": "संपर्क",
    "hero.title": "फसल की समस्याओं का शीघ्र पता लगाएं",
    "hero.subtitle": "सरल, सुरक्षित, विश्वसनीय",
    "hero.cta": "पत्ती की फोटो अपलोड करें",
    "feature.offline": "ऑफ़लाइन काम करता है",
    "feature.safe": "सुरक्षित सलाह",
    "feature.guidelines": "एफएओ-आईसीएआर दिशानिर्देश",
  },
  sw: {
    "nav.home": "Nyumbani",
    "nav.diagnose": "Chunguza",
    "nav.library": "Maktaba ya Mazao",
    "nav.chat": "Msaidizi wa AI",
    "nav.dashboard": "Dashibodi",
    "nav.experts": "Wataalam",
    "nav.alerts": "Tahadhari",
    "nav.download": "Pakua Programu",
    "nav.contact": "Wasiliana",
    "hero.title": "Gundua Matatizo ya Mazao Mapema",
    "hero.subtitle": "Rahisi, Salama, ya Kuaminika",
    "hero.cta": "Pakia Picha ya Jani",
    "feature.offline": "Inafanya Kazi Nje ya Mtandao",
    "feature.safe": "Ushauri Salama",
    "feature.guidelines": "Miongozo ya FAO-ICAR",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.diagnose": "Diagnostiquer",
    "nav.library": "Bibliothèque de Cultures",
    "nav.chat": "Assistant IA",
    "nav.dashboard": "Tableau de Bord",
    "nav.experts": "Experts",
    "nav.alerts": "Alertes",
    "nav.download": "Télécharger l'App",
    "nav.contact": "Contact",
    "hero.title": "Détecter les Problèmes de Culture Tôt",
    "hero.subtitle": "Simple, Sûr, Fiable",
    "hero.cta": "Télécharger Photo de Feuille",
    "feature.offline": "Fonctionne Hors Ligne",
    "feature.safe": "Conseils Sûrs",
    "feature.guidelines": "Directives FAO-ICAR",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.diagnose": "تشخيص",
    "nav.library": "مكتبة المحاصيل",
    "nav.chat": "مساعد الذكاء الاصطناعي",
    "nav.dashboard": "لوحة القيادة",
    "nav.experts": "الخبراء",
    "nav.alerts": "التنبيهات",
    "nav.download": "تحميل التطبيق",
    "nav.contact": "اتصل",
    "hero.title": "اكتشف مشاكل المحاصيل مبكراً",
    "hero.subtitle": "بسيط، آمن، موثوق",
    "hero.cta": "تحميل صورة الورقة",
    "feature.offline": "يعمل بدون إنترنت",
    "feature.safe": "نصائح آمنة",
    "feature.guidelines": "إرشادات الفاو-إيكار",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
