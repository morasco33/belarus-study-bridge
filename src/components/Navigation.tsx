import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation({ onApply }: { onApply: () => void }) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.universities'), href: '#universities' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.process'), href: '#process' },
    { label: t('nav.successStories'), href: '#testimonials' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToSection(href: string) {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#1E3A8A]/95 backdrop-blur-xl shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-sm leading-tight">{t('nav.brandName')}</div>
                <div className="text-white/60 text-[10px] leading-tight">{t('nav.brandTagline')}</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="px-3 py-2 text-white/80 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/10"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA + Language */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={onApply}
                className="hidden sm:inline-flex px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5"
              >
                {t('nav.applyNow')}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#1E3A8E]/98 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-white text-xl font-medium hover:text-amber-400 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => {
                setMobileOpen(false);
                onApply();
              }}
              className="mt-4 px-8 py-3 bg-amber-500 text-white font-semibold rounded-full"
            >
              {t('nav.applyNow')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
