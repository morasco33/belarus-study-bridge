import { Shield, Handshake, DollarSign, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  const features = [
    { icon: Shield, titleKey: 'about.feature1Title', descKey: 'about.feature1Desc', color: 'bg-blue-100 text-blue-600' },
    { icon: Handshake, titleKey: 'about.feature2Title', descKey: 'about.feature2Desc', color: 'bg-emerald-100 text-emerald-600' },
    { icon: DollarSign, titleKey: 'about.feature3Title', descKey: 'about.feature3Desc', color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <section id="about" ref={ref} className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className={`reveal ${isVisible ? 'visible' : ''}`}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/5]">
                <img src="/about-graduation.jpg" alt="Students celebrating graduation" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -right-3 sm:right-5 bg-[#172554] rounded-xl px-5 py-3 shadow-xl">
                <div className="text-2xl font-extrabold text-white">12+</div>
                <div className="text-white/80 text-xs">{t('about.yearsExperience')}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`reveal ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider mb-2">{t('about.sectionTag')}</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] mb-4 leading-tight">{t('about.title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('about.description')}
            </p>
            <div className="space-y-4 mb-6">
              {features.map((f) => (
                <div key={f.titleKey} className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center flex-shrink-0`}>
                    <f.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{t(f.titleKey)}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">{t(f.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 text-[#1E3A8A] font-semibold text-sm hover:gap-3 transition-all group">
              {t('about.learnMore')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
