import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server } from 'lucide-react';

const securityFeatures = [
  { icon: Lock, title: 'Cold Storage', description: '95% of assets are stored in air-gapped cold wallets with multi-signature authorization.' },
  { icon: Shield, title: 'Insurance Fund', description: 'A dedicated insurance fund protects users against potential security breaches and losses.' },
  { icon: Eye, title: 'Real-Time Monitoring', description: '24/7 automated threat detection and response systems protect your account at all times.' },
  { icon: Server, title: 'SOC 2 Compliant', description: 'Our infrastructure meets the highest standards for data security and operational reliability.' },
];

const SecuritySection = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-[#0D1117] pointer-events-none" />
    <div className="relative container mx-auto px-6 lg:px-8 py-14 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Your Security Is Our Priority</h2>
          <p className="text-[#94A3B8] leading-relaxed mb-8 max-w-lg">
            MetaTradeX employs multiple layers of protection to ensure your assets and personal data remain safe at all times. We never cut corners when it comes to security.
          </p>

          <div className="space-y-5">
            {securityFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="rounded-2xl border border-[#1E293B] bg-[rgba(20,24,45,0.5)] backdrop-blur-sm p-8 sm:p-10">
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 rounded-full bg-[#2563EB]/10 animate-pulse" />
              <div className="absolute inset-3 rounded-full bg-[#2563EB]/5 border border-[#2563EB]/20 flex items-center justify-center">
                <Shield className="w-12 h-12 text-[#2563EB]" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#1E293B]" />
                <span className="text-[#2563EB] text-xs font-semibold uppercase tracking-widest">Protected</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#1E293B]" />
              </div>
              <p className="text-white text-3xl font-bold">$4.2B+</p>
              <p className="text-[#94A3B8] text-sm">in assets secured on platform</p>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1E293B]">
                <div>
                  <p className="text-white font-semibold text-lg">256-bit</p>
                  <p className="text-[#64748B] text-xs">Encryption</p>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Multi-Sig</p>
                  <p className="text-[#64748B] text-xs">Wallets</p>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">2FA</p>
                  <p className="text-[#64748B] text-xs">Authentication</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default SecuritySection;
