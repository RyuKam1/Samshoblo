'use client';

import { useRef, useEffect } from 'react';
import RegistrationForm from './components/RegistrationForm';
import LanguageToggle from './components/LanguageToggle';
import { useLanguage } from './contexts/LanguageContext';

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const scrollToForm = () => {
    if (formRef.current) {
      // Get the form element's position
      const formElement = formRef.current;
      const formTop = formElement.offsetTop;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll position with offset for better mobile experience
      const scrollPosition = formTop - 80; // 80px offset for better positioning
      
      // Use window.scrollTo for better cross-device compatibility
      window.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
      
      // Fallback for devices that don't support smooth scroll
      if (!CSS.supports('scroll-behavior', 'smooth')) {
        window.scrollTo(0, Math.max(0, scrollPosition));
      }
    }
  };

  // Ensure smooth scrolling is supported
  useEffect(() => {
    if (!CSS.supports('scroll-behavior', 'smooth')) {
      document.documentElement.style.scrollBehavior = 'auto';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Language Toggle */}
      <LanguageToggle />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-30 text-center text-white max-w-4xl mx-auto w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 tracking-wider georgian-text leading-tight">
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              {t('ensembleName')}
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-300 leading-relaxed max-w-2xl mx-auto px-4">
            {t('heroDescription')}
          </p>
          
          <div className="space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg text-gray-400 px-4">
              {t('agesInfo')}
            </p>
            
            <button
              onClick={scrollToForm}
              onTouchEnd={(e) => {
                // Prevent double-tap zoom on mobile
                e.preventDefault();
                scrollToForm();
              }}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-base sm:text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 active:scale-95 touch-manipulation"
            >
              <span className="relative z-10">{t('registerButton')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
        
        {/* Animated Elements - Hidden on mobile for better performance */}
        <div className="hidden sm:block">
          <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-orange-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 left-20 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-black/30 backdrop-blur-sm relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          <img 
            src="/dancePic.jpg" 
            alt="Georgian Dance Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-20 max-w-6xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 px-4">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {t('aboutTitle')}
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:backdrop-blur-md hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 min-h-[240px] sm:min-h-[280px] flex flex-col justify-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-400">{t('culturalHeritage')}</h3>
              <p className="text-gray-200 leading-relaxed text-sm sm:text-base px-2">
                {t('culturalHeritageDesc')}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:backdrop-blur-md hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 min-h-[240px] sm:min-h-[280px] flex flex-col justify-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-400">{t('professionalTraining')}</h3>
              <div 
                className="text-gray-200 leading-relaxed text-sm sm:text-base px-2"
                dangerouslySetInnerHTML={{ __html: t('professionalTrainingDesc') }}
              />
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:backdrop-blur-md hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 min-h-[240px] sm:min-h-[280px] flex flex-col justify-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-400">{t('performanceOpportunities')}</h3>
              <p className="text-gray-200 leading-relaxed text-sm sm:text-base px-2">
                {t('performanceOpportunitiesDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section 
        ref={formRef} 
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-sm relative scroll-mt-20"
        id="registration-form"
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 z-10"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-20">
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
