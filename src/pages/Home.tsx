import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ApplicationModal from '@/components/ApplicationModal';
import Hero from '@/sections/Hero';
import Countries from '@/sections/Countries';
import About from '@/sections/About';
import Universities from '@/sections/Universities';
import Services from '@/sections/Services';
import Process from '@/sections/Process';
import Testimonials from '@/sections/Testimonials';
import CTA from '@/sections/CTA';
import Footer from '@/sections/Footer';

export default function Home() {
  const [showApply, setShowApply] = useState(false);

  function scrollToUniversities() {
    document.getElementById('universities')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen">
      <Navigation onApply={() => setShowApply(true)} />
      <Hero onApply={() => setShowApply(true)} onExplore={scrollToUniversities} />
      <Countries />
      <About />
      <Universities onApply={() => setShowApply(true)} />
      <Services />
      <Process />
      <Testimonials />
      <CTA onApply={() => setShowApply(true)} />
      <Footer />
      <ApplicationModal isOpen={showApply} onClose={() => setShowApply(false)} />
    </div>
  );
}
