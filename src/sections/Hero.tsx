import { useEffect, useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import gsap from 'gsap';
import ParticleCanvas from '@/components/ParticleCanvas';
import { useTranslation } from 'react-i18next';

interface HeroProps {
  onApply: () => void;
  onExplore: () => void;
}

export default function Hero({ onApply, onExplore }: HeroProps) {
  const { t } = useTranslation();
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    if (badgeRef.current) tl.fromTo(badgeRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' });
    if (titleRef.current) tl.fromTo(titleRef.current.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, '-=0.3');
    if (subtitleRef.current) tl.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');
    if (buttonsRef.current) tl.fromTo(buttonsRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.2');
    if (statsRef.current) tl.fromTo(statsRef.current.children, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.2');
    return () => { tl.kill(); };
  }, []);

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#172554] overflow-hidden">
      <ParticleCanvas />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full">
          {/* Left */}
          <div>
            <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white/90 text-sm font-medium">{t('hero.badge')}</span>
            </div>
            <div ref={titleRef}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[0.95] tracking-tight">
                <span className="block">{t('hero.titleLine1')}</span>
                <span className="block text-amber-400">{t('hero.titleLine2')}</span>
                <span className="block">{t('hero.titleLine3')}</span>
              </h1>
            </div>
            <p ref={subtitleRef} className="mt-5 text-base sm:text-lg text-white/80 max-w-lg leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div ref={buttonsRef} className="mt-7 flex flex-wrap gap-3">
              <button onClick={onApply} className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 text-sm sm:text-base">
                {t('hero.startApplication')} <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onExplore} className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 hover:border-white/60 text-white font-semibold rounded-full transition-all hover:bg-white/10 text-sm sm:text-base">
                {t('hero.exploreUniversities')}
              </button>
            </div>
            <div ref={statsRef} className="mt-8 flex flex-wrap gap-6 sm:gap-8">
              <div><div className="text-3xl sm:text-4xl font-extrabold text-white">50+</div><div className="text-white/60 text-xs sm:text-sm mt-1">{t('hero.statUniversities')}</div></div>
              <div className="w-px bg-white/20" />
              <div><div className="text-3xl sm:text-4xl font-extrabold text-amber-400">98%</div><div className="text-white/60 text-xs sm:text-sm mt-1">{t('hero.statVisa')}</div></div>
              <div className="w-px bg-white/20 hidden sm:block" />
              <div><div className="text-3xl sm:text-4xl font-extrabold text-white">15+</div><div className="text-white/60 text-xs sm:text-sm mt-1">{t('hero.statCountries')}</div></div>
            </div>
          </div>
          {/* Right - decorative space */}
          <div className="hidden lg:flex justify-center items-center" />
        </div>
      </div>
    </section>
  );
}
