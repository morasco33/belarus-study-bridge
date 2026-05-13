import { MessageCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

interface CTAProps {
  onApply: () => void;
}

export default function CTA({ onApply }: CTAProps) {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-[#1E3A8A] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-transparent to-blue-500 animate-pulse" />
      </div>

      <div className={`max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center reveal ${isVisible ? 'visible' : ''}`}>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">{t('cta.title')}</h2>
        <p className="text-white/80 mb-8 max-w-lg mx-auto">
          {t('cta.subtitle')}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={onApply} className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-full transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5">
            {t('cta.applyFree')}
          </button>
          <a href="https://wa.me/375259513458" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-full transition-all hover:shadow-lg">
            <MessageCircle className="w-5 h-5 text-green-600" />
            {t('cta.chatWhatsApp')}
          </a>
        </div>
      </div>
    </section>
  );
}
