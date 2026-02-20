import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'CryptoInsider',
    role: 'Crypto Analyst',
    quote: 'MetaTradeX has set a new standard for retail crypto trading platforms. Their UI is simply phenomenal.',
    avatar: 'CI',
    rating: 5,
  },
  {
    name: 'John D.',
    role: 'Professional Trader',
    quote: 'The speed and reliability are unmatched. I can execute my strategies with confidence every single day.',
    avatar: 'JD',
    rating: 5,
  },
  {
    name: 'Jane S.',
    role: 'Long-term Investor',
    quote: 'A secure and intuitive platform. The portfolio overview is exactly what I need to track my assets.',
    avatar: 'JS',
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-14"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-white">What Our Users Say</h2>
      <p className="text-[#94A3B8] mt-3 max-w-lg mx-auto">Trusted by traders and investors worldwide.</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="rounded-2xl border border-[#1E293B] bg-[rgba(20,24,45,0.5)] backdrop-blur-sm p-6"
        >
          <div className="flex text-yellow-400 mb-4 gap-0.5">
            {[...Array(t.rating)].map((_, j) => (
              <Star key={j} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <blockquote className="text-[#94A3B8] text-sm leading-relaxed mb-6">"{t.quote}"</blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 flex items-center justify-center">
              <span className="text-[#2563EB] text-sm font-bold">{t.avatar}</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{t.name}</p>
              <p className="text-[#64748B] text-xs">{t.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default TestimonialsSection;
