import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ShieldCheck, BarChartBig, Clock, Users, Award } from 'lucide-react';

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Blazing Fast Execution",
      description: "Experience near-instant trade execution, ensuring you get the price you want without slippage."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Bank-Grade Security",
      description: "Your assets are protected with multi-layer security, cold storage, and regular audits."
    },
    {
      icon: <BarChartBig className="h-8 w-8 text-primary" />,
      title: "Advanced Charting Tools",
      description: "Utilize a full suite of professional-grade tools and indicators to analyze the market."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "24/7 Customer Support",
      description: "Our dedicated support team is available around the clock to assist you with any inquiries."
    }
  ];

  const whyChooseUs = [
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      title: "User-Centric Design",
      description: "An intuitive interface designed for both beginners and professional traders."
    },
    {
      icon: <Award className="h-8 w-8 text-secondary" />,
      title: "Competitive Fees",
      description: "Transparent and low-fee structure to maximize your trading profits."
    },
    {
      icon: <Zap className="h-8 w-8 text-secondary" />,
      title: "Continuous Innovation",
      description: "We are constantly evolving, adding new features and assets to enhance your experience."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Features - MetaTradeX</title>
        <meta name="description" content="Discover the powerful features of MetaTradeX and why we are the best choice for your trading needs." />
      </Helmet>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight gradient-text">Features & Why Choose Us</h1>
          <p className="mt-4 text-md sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Engineered for performance, designed for you. Discover the MetaTradeX advantage.
          </p>
        </motion.div>

        <section className="mb-12 sm:mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Our Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glassmorphic h-full">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">{feature.icon}</div>
                    <CardTitle className="text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Why Choose MetaTradeX?</h2>
            <p className="mt-2 text-muted-foreground">The clear choice for smart traders.</p>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="p-8 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 text-center"
                >
                  <div className="inline-block bg-secondary/10 p-4 rounded-full mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Features;