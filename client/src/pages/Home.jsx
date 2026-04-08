import Hero from '../sections/Hero';
import Features from '../sections/Features';
import HowItWorks from '../sections/HowItWorks';
import DashboardPreview from '../sections/DashboardPreview';
import UseCases from '../sections/UseCases';
import Testimonials from '../sections/Testimonials';
import Pricing from '../sections/Pricing';
import Security from '../sections/Security';
import Resources from '../sections/Resources';
import Contact from '../sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <UseCases />
      <Testimonials />
      <Pricing />
      <Security />
      <Resources />
      <Contact />
    </>
  );
}
