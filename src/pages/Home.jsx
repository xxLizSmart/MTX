import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import NewHero from '@/components/NewHero';
import TrustBanner from '@/components/home/TrustBanner';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import MarketsPreview from '@/components/home/MarketsPreview';
import SecuritySection from '@/components/home/SecuritySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaSection from '@/components/home/CtaSection';

const Home = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>MetaTradeX - {t('subtitle')}</title>
        <meta name="description" content="MetaTradeX is a professional cryptocurrency trading platform offering advanced tools, secure wallet, and 24/7 support." />
      </Helmet>
      <div className="pb-24 overflow-hidden">
        <NewHero />
        <TrustBanner />
        <FeaturesSection />
        <HowItWorksSection />
        <MarketsPreview />
        <SecuritySection />
        <TestimonialsSection />
        <CtaSection />
      </div>
    </>
  );
};

export default Home;
