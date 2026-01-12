'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface RegistrationData {
  childName: string;
  childSurname: string;
  childAge: string;
  parentName: string;
  parentSurname: string;
  parentPhone: string;
}

export default function RegistrationForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<RegistrationData>({
    childName: '',
    childSurname: '',
    childAge: '',
    parentName: '',
    parentSurname: '',
    parentPhone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          childName: '',
          childSurname: '',
          childAge: '',
          parentName: '',
          parentSurname: '',
          parentPhone: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            {t('joinTitle')}
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 px-4">
          {t('joinSubtitle')}
        </p>
      </div>

      <div className="bg-black/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Child Information */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4">{t('childInfo')}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="childName" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('childName')}
                </label>
                <input
                  type="text"
                  id="childName"
                  name="childName"
                  value={formData.childName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                  placeholder={t('enterChildName')}
                />
              </div>
              
              <div>
                <label htmlFor="childSurname" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('childSurname')}
                </label>
                <input
                  type="text"
                  id="childSurname"
                  name="childSurname"
                  value={formData.childSurname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                  placeholder={t('enterChildSurname')}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="childAge" className="block text-sm font-medium text-gray-300 mb-2">
                {t('childAge')}
              </label>
              <input
                type="number"
                id="childAge"
                name="childAge"
                value={formData.childAge}
                onChange={handleInputChange}
                required
                min="5"
                max="15"
                className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                placeholder={t('enterAge')}
              />
            </div>
          </div>

          {/* Parent Information */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-xl sm:text-2xl font-bold text-amber-400 mb-4">{t('parentInfo')}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="parentName" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('parentName')}
                </label>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                  placeholder={t('enterParentName')}
                />
              </div>
              
              <div>
                <label htmlFor="parentSurname" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('parentSurname')}
                </label>
                <input
                  type="text"
                  id="parentSurname"
                  name="parentSurname"
                  value={formData.parentSurname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                  placeholder={t('enterParentSurname')}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-300 mb-2">
                {t('parentPhone')}
              </label>
              <input
                type="tel"
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleInputChange}
                required
                className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                placeholder={t('enterPhone')}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-base sm:text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <span className="relative z-10">
                {isSubmitting ? t('submitting') : t('submitRegistration')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center backdrop-blur-sm text-sm sm:text-base">
              {t('successMessage')}
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center backdrop-blur-sm text-sm sm:text-base">
              {t('errorMessage')}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
