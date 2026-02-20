import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Clock, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: '2M+', label: 'Active Traders' },
  { icon: Globe, value: '180+', label: 'Countries Served' },
  { icon: TrendingUp, value: '$4.2B+', label: 'Daily Volume' },
  { icon: Clock, value: '99.99%', label: 'Uptime' },
];

const TrustBanner = () => (
  <section className="border-y border-[#1E293B] bg-[#0D1117]">
    <div className="container mx-auto px-6 lg:px-8 py-10 sm:py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center text-center gap-2"
          >
            <stat.icon className="w-6 h-6 text-[#2563EB] mb-1" />
            <span className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</span>
            <span className="text-sm text-[#94A3B8]">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBanner;
