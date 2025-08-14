'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm sm:text-lg rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/20 backdrop-blur-sm language-toggle"
      title={language === 'georgian' ? 'Switch to English' : 'ქართულად გადართვა'}
    >
      {language === 'georgian' ? 'EN' : 'ქა'}
    </button>
  );
}
