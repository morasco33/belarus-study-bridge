import { useState } from 'react';
import { X, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { useTranslation } from 'react-i18next';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationModal({ isOpen, onClose }: ApplicationModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    country: '',
    program: '',
    educationLevel: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const createApplication = trpc.application.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  if (!isOpen) return null;

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = t('application.firstNameRequired');
    if (!formData.lastName.trim()) newErrors.lastName = t('application.lastNameRequired');
    if (!formData.email.trim()) newErrors.email = t('application.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('application.invalidEmail');
    if (!formData.whatsapp.trim()) newErrors.whatsapp = t('application.whatsappRequired');
    if (!formData.country) newErrors.country = t('application.countryRequired');
    if (!formData.program) newErrors.program = t('application.programRequired');
    if (!formData.educationLevel) newErrors.educationLevel = t('application.educationRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    createApplication.mutate(formData);
  }

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        firstName: '', lastName: '', email: '', whatsapp: '',
        country: '', program: '', educationLevel: '', message: '',
      });
      setErrors({});
    }, 300);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('application.successTitle')}</h3>
            <p className="text-gray-600">{t('application.successMessage')}</p>
            <button
              onClick={handleClose}
              className="mt-6 px-6 py-2.5 bg-[#1E3A8A] text-white rounded-full font-medium hover:bg-[#172554] transition-colors"
            >
              {t('application.close')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-7">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{t('application.startApplication')}</h3>
            <p className="text-sm text-gray-500 mb-6">{t('application.fillDetails')}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('application.firstName')} *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition-all ${errors.firstName ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('application.lastName')} *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition-all ${errors.lastName ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('application.email')} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('application.whatsapp')} *</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition-all ${errors.whatsapp ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="+234 80 1234 5678"
                />
                {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('application.country')} *</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition-all bg-white ${errors.country ? 'border-red-400' : 'border-gray-200'}`}
                >
                  <option value="">{t('application.selectCountry')}</option>
                  {['Nigeria', 'Ghana', 'Kenya', 'Ethiopia', 'Zambia', 'Cameroon', 'Other'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('application.program')} *</label>
                <select
                  value={formData.program}
                  onChange={(e) => handleChange('program', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition-all bg-white ${errors.program ? 'border-red-400' : 'border-gray-200'}`}
                >
                  <option value="">{t('application.selectProgram')}</option>
                  {[
                    'General Medicine (6 years)',
                    'Dentistry (5 years)',
                    'Pharmacy (5 years)',
                    'Engineering (4 years)',
                    'Computer Science (4 years)',
                    'Economics (4 years)',
                    'Preparatory Course (1 year)',
                  ].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('application.educationLevel')} *</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => handleChange('educationLevel', e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition-all bg-white ${errors.educationLevel ? 'border-red-400' : 'border-gray-200'}`}
              >
                <option value="">{t('application.selectLevel')}</option>
                {['High School / Secondary', "Bachelor's Degree", "Master's Degree"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              {errors.educationLevel && <p className="text-red-500 text-xs mt-1">{errors.educationLevel}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('application.message')}</label>
              <textarea
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition-all resize-none"
                rows={3}
                placeholder={t('application.messagePlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={createApplication.isPending}
              className="w-full py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {createApplication.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('application.submitting')}
                </>
              ) : (
                t('application.submit')
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-gray-400 text-xs">
              <Lock className="w-3 h-3" />
              <span>{t('application.secure')}</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
