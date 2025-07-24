'use client';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import HeroSection from '@/components/landing/HeroSection';
import FeatureSection from '@/components/landing/FeatureSection';
import WhySection from '@/components/landing/WhySection';
import FooterCTA from '@/components/landing/FooterCTA';

export default function HomePage() {
  return (
    <Layout>
      <Seo templateTitle='Beranda' />
      <HeroSection />
      <FeatureSection />
      <WhySection />
      <FooterCTA />
    </Layout>
  );
}
