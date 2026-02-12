import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Globe, Shield } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>About - MetaTradeX</title>
        <meta name="description" content="Pioneering the future of digital asset trading with innovation, security, and integrity." />
      </Helmet>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight gradient-text">About Us</h1>
          <p className="mt-4 text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Pioneering the future of digital asset trading with innovation, security, and integrity.
          </p>
        </motion.div>

        <div className="relative mb-12 sm:mb-20">
          <img alt="Modern office with team collaborating" className="w-full h-[250px] sm:h-[400px] object-cover rounded-2xl shadow-2xl" src="https://images.unsplash.com/photo-1535504663857-dab4d2908557" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12 sm:mb-20 text-center">
          <Card className="glassmorphic">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4"><Target className="h-8 w-8 text-primary" /></div>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">To provide a secure, efficient, and user-friendly platform for cryptocurrency trading, empowering individuals to access the digital economy with confidence.</p>
            </CardContent>
          </Card>
          <Card className="glassmorphic">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4"><Globe className="h-8 w-8 text-primary" /></div>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">To become the world's most trusted and innovative digital asset exchange, bridging the gap between traditional finance and the future of money.</p>
            </CardContent>
          </Card>
          <Card className="glassmorphic">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4"><Shield className="h-8 w-8 text-primary" /></div>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">We are committed to security, transparency, customer-centricity, and continuous innovation in everything we do.</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  );
};

export default About;