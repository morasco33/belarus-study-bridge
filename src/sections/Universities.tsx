import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

const badgeStyles: Record<string, string> = {
  'top-ranked': 'bg-amber-500 text-white',
  'popular': 'bg-blue-500 text-white',
  'medical': 'bg-emerald-500 text-white',
};

const universities = [
  {
    id: 1, name: "Belarusian State University", location: "Minsk", established: 1921,
    programs: ["Medicine", "Engineering", "Economics"],
    badge: "top-ranked", image: "/university-bsu.jpg"
  },
  {
    id: 2, name: "BNTU", location: "Minsk", established: 1920,
    programs: ["Technology", "Architecture", "IT"],
    badge: "popular", image: "/university-bntu.jpg"
  },
  {
    id: 3, name: "Belarusian State Medical University", location: "Minsk", established: 1921,
    programs: ["General Medicine", "Dentistry", "Pharmacy"],
    badge: "medical", image: "/university-medical.jpg"
  },
  {
    id: 4, name: "Grodno State Medical University", location: "Grodno", established: 1958,
    programs: ["Medicine", "Pediatrics", "Nursing"],
    badge: null, image: "/university-grodno.jpg"
  },
  {
    id: 5, name: "Vitebsk State Medical University", location: "Vitebsk", established: 1934,
    programs: ["Medicine", "Dentistry", "Pre-med"],
    badge: null, image: "/university-vitebsk.jpg"
  },
  {
    id: 6, name: "Gomel State Medical University", location: "Gomel", established: 1990,
    programs: ["Medicine", "Pharmacy", "Nursing"],
    badge: null, image: "/university-gomel.jpg"
  },
  {
    id: 7, name: "Sukhoi State Technical University of Gomel", location: "Gomel", established: 1968,
    programs: ["Engineering", "IT", "Mechanical Engineering"],
    badge: "popular", image: "/university-sukhoi.jpg"
  },
];

const badgeLabels: Record<string, string> = {
  'top-ranked': 'universities.topRanked',
  'popular': 'universities.popular',
  'medical': 'universities.medical',
};

interface UniversitiesProps {
  onApply: () => void;
}

export default function Universities({ onApply }: UniversitiesProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="universities" ref={ref} className="py-16 lg:py-24 bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider mb-2">{t('universities.sectionTag')}</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] mb-3">{t('universities.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('universities.subtitle')}</p>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger ${isVisible ? 'visible' : ''}`}>
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {uni.badge && (
                  <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyles[uni.badge]}`}>
                    {t(badgeLabels[uni.badge])}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-0.5">{uni.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{uni.location} &bull; {t('universities.established')} {uni.established}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {uni.programs.map((p) => (
                    <span key={p} className="px-2 py-0.5 bg-[#F1F5F9] text-[#1E3A8A] text-xs font-medium rounded-full">{p}</span>
                  ))}
                </div>
                <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                  <button onClick={onApply} className="inline-flex items-center gap-1 text-[#1E3A8A] font-semibold text-xs hover:underline">
                    {t('universities.apply')} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
