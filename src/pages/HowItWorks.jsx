import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Wallet, BarChart2, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: <UserPlus className="h-10 w-10 text-primary" />,
      title: '1. Create Your Account',
      description: 'Sign up in minutes with your email or phone number. Complete our quick KYC process to secure your account and unlock all features.'
    },
    {
      icon: <Wallet className="h-10 w-10 text-primary" />,
      title: '2. Deposit Funds',
      description: 'Securely deposit cryptocurrencies into your MetaTrader4 wallet. We support a variety of networks for your convenience.'
    },
    {
      icon: <BarChart2 className="h-10 w-10 text-primary" />,
      title: '3. Start Trading',
      description: 'Access our professional trading interface. Use advanced charting tools, place orders, and manage your portfolio like a pro.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>How It Works - MetaTradeX</title>
        <meta name="description" content="Your seamless journey into the world of crypto trading starts here." />
      </Helmet>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight gradient-text">How It Works</h1>
          <p className="mt-4 text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Your seamless journey into the world of crypto trading starts here.
          </p>
        </motion.div>

        <div className="relative flex flex-col items-center">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <motion.div 
                      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.7 }}
                      className="w-full md:w-3/5 my-4"
                    >
                        <Card className="glowing-border glassmorphic overflow-hidden">
                            <div className="flex items-center p-6">
                                <div className="mr-6">{step.icon}</div>
                                <div>
                                    <CardTitle className="mb-2 text-xl sm:text-2xl">{step.title}</CardTitle>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className="h-12 md:h-20 w-1 bg-primary/20 rounded-full items-center justify-center">
                      </div>
                    )}
                </React.Fragment>
            ))}
        </div>
        
        <div className="mt-12 sm:mt-20 text-center">
            <img alt="A person looking at trading charts on a futuristic interface" className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl" src="https://images.unsplash.com/photo-1640340435016-1964cf4e723b" />
        </div>

      </div>
    </>
  );
};

export default HowItWorks;