import { GraduationCap, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.universities'), href: '#universities' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.process'), href: '#process' },
  ];

  const programs = [
    t('footer.generalMedicine'),
    t('footer.computerScience'),
    t('footer.engineering'),
    t('footer.economicsMBA'),
    t('footer.preparatoryCourse'),
  ];

  return (
    <footer className="bg-[#0F172A] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">{t('nav.brandName')}</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {t('footer.brandDesc')}
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/375259513458"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-green-500/20 hover:bg-green-500/30 flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.programs')}</h4>
            <ul className="space-y-2.5">
              {programs.map((program) => (
                <li key={program}>
                  <span className="text-gray-400 text-sm">{program}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contactUs')}</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Agarenka, Gomel</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+375259513458</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Morasco33@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <a href="https://wa.me/375259513458" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-green-400 transition-colors">WhatsApp: +375259513458</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">{t('footer.copyright')}</p>
          <div className="flex gap-6">
            {[t('footer.privacyPolicy'), t('footer.termsOfService'), t('footer.cookiePolicy')].map((link) => (
              <span key={link} className="text-gray-500 text-sm hover:text-gray-300 cursor-pointer transition-colors">
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
