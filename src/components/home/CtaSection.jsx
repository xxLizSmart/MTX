import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const CtaSection = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0" style={{ background: 'linear-gradient(165deg, #0B0E1E 0%, #111832 50%, #0B0E1E 100%)' }} />
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2563EB]/[0.06] blur-[150px]" />
    </div>
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Ready to Start Trading?</h2>
        <p className="text-[#94A3B8] mb-10 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
          Join millions of users and start your crypto journey today. Access advanced tools, top-tier liquidity, and 24/7 support.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition-colors"
          >
            <Zap className="w-4 h-4 mr-2" />
            Create Free Account
          </Link>
          <Link
            to="/trading"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-[#1E293B] bg-transparent hover:bg-[rgba(20,24,45,0.5)] text-white font-semibold text-sm transition-colors"
          >
            Explore Trading
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CtaSection;
