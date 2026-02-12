import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ShieldCheck, Layers, Star, Target, Globe, Shield, UserPlus, Wallet, BarChart2 } from 'lucide-react';
import NewHero from '@/components/NewHero';
import MobileHero from '@/components/MobileHero';

const Home = () => {
  const { t } = useLanguage();

  const features = [{
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Lightning-Fast Trades",
    description: "Execute trades in milliseconds with our high-performance matching engine."
  }, {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Bank-Grade Security",
    description: "Your assets are protected by industry-leading security protocols and cold storage."
  }, {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: "Deep Liquidity",
    description: "Access a deep order book for competitive prices and minimal slippage."
  }];

  const testimonials = [{
    name: "CryptoInsider",
    quote: "MetaTradeX has set a new standard for retail crypto trading platforms. Their UI is simply phenomenal.",
    avatar: "CI"
  }, {
    name: "John Doe, Pro Trader",
    quote: "The speed and reliability are unmatched. I can execute my strategies with confidence.",
    avatar: "JD"
  }, {
    name: "Jane Smith, Investor",
    quote: "A secure and intuitive platform. The portfolio overview is exactly what I need to track my assets.",
    avatar: "JS"
  }];

  const aboutCards = [{
    icon: <Target className="h-8 w-8 text-primary" />,
    title: "Our Mission",
    description: "To provide a secure, efficient, and user-friendly platform for cryptocurrency trading, empowering individuals to access the digital economy with confidence."
  }, {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Our Vision",
    description: "To become the world's most trusted and innovative digital asset exchange, bridging the gap between traditional finance and the future of money."
  }, {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Our Values",
    description: "We are committed to security, transparency, customer-centricity, and continuous innovation in everything we do."
  }];

  const howItWorksSteps = [{
    icon: <UserPlus className="h-10 w-10 text-primary" />,
    title: '1. Create Your Account',
    description: 'Sign up in minutes. Complete our quick KYC process to secure your account and unlock all features.'
  }, {
    icon: <Wallet className="h-10 w-10 text-primary" />,
    title: '2. Deposit Funds',
    description: 'Securely deposit cryptocurrencies into your MetaTradeX wallet. We support a variety of networks.'
  }, {
    icon: <BarChart2 className="h-10 w-10 text-primary" />,
    title: '3. Start Trading',
    description: 'Access our professional trading interface, place orders, and manage your portfolio like a pro.'
  }];

  return (
    <>
      <Helmet>
        <title>MetaTradeX - {t('subtitle')}</title>
        <meta name="description" content="MetaTradeX is a professional cryptocurrency trading platform offering advanced tools, secure wallet, and 24/7 support." />
      </Helmet>
      <div className="pb-24 overflow-hidden">
        
        <NewHero />
        <MobileHero />

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold">Why Choose MetaTradeX?</h2>
                <p className="text-muted-foreground mt-2">The ultimate platform for serious traders.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => <Card key={index} className="text-center glassmorphic glowing-border">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 dark:bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>)}
            </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold">How It Works</h2>
                <p className="text-muted-foreground mt-2">Your seamless journey into crypto trading starts here.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {howItWorksSteps.map((step, index) => <Card key={index} className="text-center glassmorphic">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 dark:bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                                {step.icon}
                            </div>
                            <CardTitle>{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{step.description}</p>
                        </CardContent>
                    </Card>)}
            </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold">About MetaTradeX</h2>
                <p className="text-muted-foreground mt-2">Pioneering the future of digital asset trading.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {aboutCards.map((card, index) => <Card key={index} className="text-center glassmorphic">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 dark:bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                                {card.icon}
                            </div>
                            <CardTitle>{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{card.description}</p>
                        </CardContent>
                    </Card>)}
            </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold">What Our Users Say</h2>
                <p className="text-muted-foreground mt-2">Trusted by traders and investors worldwide.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => <Card key={index} className="flex flex-col">
                        <CardContent className="pt-6 flex-grow">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                    <span className="font-bold text-primary">{testimonial.avatar}</span>
                                </div>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                                    </div>
                                </div>
                            </div>
                            <blockquote className="text-muted-foreground italic">"{testimonial.quote}"</blockquote>
                        </CardContent>
                    </Card>)}
            </div>
        </section>

        <section className="bg-secondary/50 py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold mb-4">Ready to Start Trading?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Join thousands of users and start your crypto journey today. Access advanced tools, top-tier liquidity, and 24/7 support.</p>
                <Button asChild size="lg" className="group">
                    <Link to="/trading">
                        <Zap className="mr-2 h-5 w-5" />
                        {t('startTrading')}
                    </Link>
                </Button>
            </div>
        </section>
      </div>
    </>
  );
};

export default Home;