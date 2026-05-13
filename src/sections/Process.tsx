import { MessageSquare, FileCheck, Send, FileText, Plane, Building2 } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

const steps = [
  { num: 1, titleKey: 'process.step1Title', descKey: 'process.step1Desc', icon: MessageSquare },
  { num: 2, titleKey: 'process.step2Title', descKey: 'process.step2Desc', icon: FileCheck },
  { num: 3, titleKey: 'process.step3Title', descKey: 'process.step3Desc', icon: Send },
  { num: 4, titleKey: 'process.step4Title', descKey: 'process.step4Desc', icon: FileText },
  { num: 5, titleKey: 'process.step5Title', descKey: 'process.step5Desc', icon: Plane },
  { num: 6, titleKey: 'process.step6Title', descKey: 'process.step6Desc', icon: Building2 },
];

export default function Process() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="process" ref={ref} className="py-16 lg:py-24 bg-[#1E3A8A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">{t('process.sectionTag')}</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">{t('process.title')}</h2>
          <p className="text-white/70 max-w-xl mx-auto">{t('process.subtitle')}</p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute top-7 left-[8%] right-[8%] h-0.5 bg-white/20" />
          <div className={`flex justify-between relative reveal-stagger ${isVisible ? 'visible' : ''}`}>
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center" style={{ width: '14%' }}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 text-white font-bold text-lg shadow-lg ${
                  step.num === 1 ? 'bg-amber-500' : 'bg-white/10 border border-white/20'
                }`}>
                  {step.num}
                </div>
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                  <step.icon className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{t(step.titleKey)}</h4>
                <p className="text-white/60 text-xs leading-relaxed max-w-[130px]">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-5">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                step.num === 1 ? 'bg-amber-500' : 'bg-white/10 border border-white/20'
              }`}>
                {step.num}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <step.icon className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-white text-sm">{t(step.titleKey)}</h4>
                </div>
                <p className="text-white/60 text-xs">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
