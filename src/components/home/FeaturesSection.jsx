import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Layers, RefreshCw, Headphones, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning-Fast Trades',
    description: 'Execute trades in milliseconds with our high-performance matching engine and low-latency infrastructure.',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    description: 'Your assets are protected by industry-leading security protocols, multi-sig wallets, and cold storage.',
  },
  {
    icon: Layers,
    title: 'Deep Liquidity',
    description: 'Access a deep order book for competitive prices and minimal slippage across hundreds of trading pairs.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Charting',
    description: 'Professional-grade TradingView charts with 100+ indicators, drawing tools, and real-time data feeds.',
  },
  {
    icon: RefreshCw,
    title: 'Instant Settlements',
    description: 'Deposits and withdrawals processed within minutes. No waiting days for your funds to arrive.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to help you with any questions or issues.',
  },
];

const FeaturesSection = () => (
  <section className="container mx-auto px-6 lg:px-8 py-14 lg:py-28">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-14"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Why Choose MetaTradeX?</h2>
      <p className="text-[#94A3B8] mt-3 max-w-lg mx-auto text-sm sm:text-base">The ultimate platform for serious traders. Everything you need to succeed in one place.</p>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="group rounded-2xl border border-[#1E293B] bg-[rgba(20,24,45,0.5)] backdrop-blur-sm p-6 hover:border-[#2563EB]/30 hover:bg-[rgba(20,24,45,0.7)] transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center mb-4 group-hover:bg-[#2563EB]/20 transition-colors">
            <feature.icon className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
          <p className="text-sm text-[#94A3B8] leading-relaxed">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
