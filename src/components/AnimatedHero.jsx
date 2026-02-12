import React from 'react';
    import { motion } from 'framer-motion';
    import { ArrowRight } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { useLanguage } from '@/contexts/LanguageContext';
    
    const AnimatedHero = () => {
      const navigate = useNavigate();
      const { t } = useLanguage();
    
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
          },
        },
      };
    
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
          },
        },
      };
    
      return (
        <section className="relative text-center pt-20 md:pt-28 lg:pt-32 min-h-[80vh] flex items-center justify-center isolate overflow-hidden">
          <img 
            src="https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/de7ff9e4f1c8822fe2f5f724b9e5efb1.webp" 
            alt="Animated hero background"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80 dark:bg-background/90 -z-10"></div>
    
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2
                variants={itemVariants}
                className="text-xl md:text-2xl font-semibold text-primary mb-4"
              >
                Better Liquidity, Better Trading
              </motion.h2>
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500"
              >
                The Future of Trading is Here
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl mb-10"
              >
                Join the next generation of finance. Trade cryptocurrencies with high leverage, deep liquidity, and a secure, user-friendly platform.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto group text-lg py-7 px-10"
                  onClick={() => navigate('/trading')}
                >
                  {t('startTrading')}{' '}
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      );
    };
    
    export default AnimatedHero;