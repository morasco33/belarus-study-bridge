import { Star, Quote } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

const testimonials = [
  { id: 1, name: 'Chinedu Okafor', country: 'Nigeria', program: 'Medicine', university: 'BSMU', quote: "Belarus Study Bridge made my dream come true. From admission to settling in Minsk, they handled everything professionally. Now I'm in my 3rd year of Medicine!", rating: 5 },
  { id: 2, name: 'Ama Serwaa', country: 'Ghana', program: 'Engineering', university: 'BNTU', quote: "The visa process seemed impossible until I found this consultancy. They prepared me for everything. I'm now studying Computer Engineering in Minsk!", rating: 5 },
  { id: 3, name: 'Jean-Pierre Mutombo', country: 'DRC', program: 'Economics', university: 'BSU', quote: "Affordable tuition, quality education, and amazing support from the team. They even helped me find part-time work legally. Highly recommended!", rating: 5 },
];

export default function Testimonials() {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="testimonials" ref={ref} className="py-16 lg:py-24 bg-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider mb-2">{t('testimonials.sectionTag')}</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] mb-3">{t('testimonials.title')}</h2>
        </div>

        <div className={`grid md:grid-cols-3 gap-6 reveal-stagger ${isVisible ? 'visible' : ''}`}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <Quote className="w-7 h-7 text-[#1E3A8A]/20 mb-2" />
              <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-gray-500 text-xs">{testimonial.country} &bull; {testimonial.program}, {testimonial.university}</div>
                </div>
              </div>

              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
