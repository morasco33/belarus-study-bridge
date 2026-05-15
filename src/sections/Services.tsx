import { FileText, Globe, Plane, Home, BookOpen, Heart, CreditCard, Briefcase } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

const iconMap: Record<string, React.ElementType> = {
  FileText, Globe, Plane, Home, BookOpen, Heart, CreditCard, Briefcase,
};

const services = [
  { titleKey: 'services.admissionTitle', descKey: 'services.admissionDesc', icon: 'FileText', color: 'bg-blue-100 text-blue-600' },
  { titleKey: 'services.visaTitle', descKey: 'services.visaDesc', icon: 'Globe', color: 'bg-emerald-100 text-emerald-600' },
  { titleKey: 'services.travelTitle', descKey: 'services.travelDesc', icon: 'Plane', color: 'bg-amber-100 text-amber-600' },
  { titleKey: 'services.accommodationTitle', descKey: 'services.accommodationDesc', icon: 'Home', color: 'bg-purple-100 text-purple-600' },
  { titleKey: 'services.languageTitle', descKey: 'services.languageDesc', icon: 'BookOpen', color: 'bg-rose-100 text-rose-600' },
  { titleKey: 'services.medicalTitle', descKey: 'services.medicalDesc', icon: 'Heart', color: 'bg-teal-100 text-teal-600' },
  { titleKey: 'services.residencyTitle', descKey: 'services.residencyDesc', icon: 'CreditCard', color: 'bg-indigo-100 text-indigo-600' },
  { titleKey: 'services.careerTitle', descKey: 'services.careerDesc', icon: 'Briefcase', color: 'bg-orange-100 text-orange-600' },
];

export default function Services() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="services" ref={ref} className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider mb-2">{t('services.sectionTag')}</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] mb-3">{t('services.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('services.subtitle')}</p>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal-stagger ${isVisible ? 'visible' : ''}`}>
          {services.map((service) => {
            const IconComp = iconMap[service.icon] || FileText;
            return (
              <div key={service.titleKey} className="bg-[#F8FAFC] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-11 h-11 rounded-xl ${service.color} flex items-center justify-center mb-3`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1.5">{t(service.titleKey)}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{t(service.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
