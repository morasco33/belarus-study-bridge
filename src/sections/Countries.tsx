import { Flag } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

const countries = [
  { key: 'nigeria', count: '200+', type: 'students', gradient: 'linear-gradient(135deg, #16A34A, #15803D)' },
  { key: 'ghana', count: '150+', type: 'students', gradient: 'linear-gradient(135deg, #DC2626, #F59E0B)' },
  { key: 'ethiopia', count: '80+', type: 'students', gradient: 'linear-gradient(135deg, #059669, #D97706)' },
  { key: 'kenya', count: '120+', type: 'students', gradient: 'linear-gradient(135deg, #7C2D12, #15803D)' },
  { key: 'zambia', count: '60+', type: 'students', gradient: 'linear-gradient(135deg, #15803D, #EA580C)' },
  { key: 'others', count: '10+', type: 'countries', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
];

export default function Countries() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider mb-2">{t('countries.sectionTag')}</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] mb-3">{t('countries.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('countries.subtitle')}</p>
        </div>

        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 reveal-stagger ${isVisible ? 'visible' : ''}`}>
          {countries.map((country) => (
            <div
              key={country.key}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="h-28 flex flex-col items-center justify-center" style={{ background: country.gradient }}>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
                  <Flag className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-white text-base">{t(`countries.${country.key}`)}</h3>
                <p className="text-xs text-white/80">{country.count} {t(`countries.${country.type}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
