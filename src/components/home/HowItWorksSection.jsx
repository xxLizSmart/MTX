import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Wallet, BarChart2, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in minutes. Complete our quick KYC process to secure your account and unlock all features.',
  },
  {
    icon: Wallet,
    number: '02',
    title: 'Deposit Funds',
    description: 'Securely deposit cryptocurrencies into your MetaTradeX wallet. We support a variety of networks.',
  },
  {
    icon: BarChart2,
    number: '03',
    title: 'Start Trading',
    description: 'Access our professional trading interface, place orders, and manage your portfolio like a pro.',
  },
];

const HowItWorksSection = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-[#0D1117] pointer-events-none" />
    <div className="relative container mx-auto px-6 lg:px-8 py-14 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">How It Works</h2>
        <p className="text-[#94A3B8] mt-3 max-w-lg mx-auto text-sm sm:text-base">Your seamless journey into crypto trading starts here.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative text-center"
          >
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-6">
              <step.icon className="w-8 h-8 text-[#2563EB]" />
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center">
                {step.number}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-xs mx-auto">{step.description}</p>

            {i < steps.length - 1 && (
              <div className="hidden md:flex absolute top-10 -right-6 lg:-right-8">
                <ArrowRight className="w-5 h-5 text-[#1E293B]" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
