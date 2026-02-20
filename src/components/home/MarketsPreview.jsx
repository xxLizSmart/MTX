import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CRYPTO_PRICES } from '@/lib/cryptoPrices';

const markets = [
  { symbol: 'BTC', name: 'Bitcoin', icon: CRYPTO_PRICES.BTC.icon_url, price: CRYPTO_PRICES.BTC.price, change: 2.34, volume: '2.1B' },
  { symbol: 'ETH', name: 'Ethereum', icon: CRYPTO_PRICES.ETH.icon_url, price: CRYPTO_PRICES.ETH.price, change: -1.12, volume: '980M' },
  { symbol: 'SOL', name: 'Solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', price: 83.58, change: 5.67, volume: '520M' },
  { symbol: 'XRP', name: 'Ripple', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', price: 1.42, change: -0.46, volume: '340M' },
  { symbol: 'USDT', name: 'Tether', icon: CRYPTO_PRICES.USDT.icon_url, price: CRYPTO_PRICES.USDT.price, change: 0.01, volume: '48B' },
  { symbol: 'USDC', name: 'USD Coin', icon: CRYPTO_PRICES.USDC.icon_url, price: CRYPTO_PRICES.USDC.price, change: 0.00, volume: '5.2B' },
];

const formatPrice = (price) =>
  price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MiniSparkline = ({ positive }) => {
  const d = positive
    ? 'M0 16 L6 14 L12 15 L18 10 L24 12 L30 7 L36 9 L42 4 L48 6'
    : 'M0 4 L6 6 L12 5 L18 10 L24 8 L30 13 L36 11 L42 16 L48 14';
  return (
    <svg viewBox="0 0 48 20" className="w-20 h-8" fill="none">
      <path d={d} stroke={positive ? '#22c55e' : '#ef4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const MarketsPreview = () => (
  <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4"
    >
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Popular Markets</h2>
        <p className="text-[#94A3B8] mt-2">Track the markets that matter. Trade with confidence.</p>
      </div>
      <Link to="/assets" className="text-[#2563EB] text-sm font-medium hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 shrink-0">
        View all markets <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-[#1E293B] bg-[rgba(20,24,45,0.5)] backdrop-blur-sm overflow-hidden"
    >
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-[#1E293B] text-xs text-[#64748B] font-medium uppercase tracking-wider">
        <span>Asset</span>
        <span className="text-right">Price</span>
        <span className="text-right">24h Change</span>
        <span className="text-right">Volume</span>
        <span className="text-right">Chart</span>
      </div>

      {markets.map((market, i) => (
        <Link
          key={market.symbol}
          to="/trading"
          className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 border-b border-[#1E293B]/50 last:border-b-0 hover:bg-[rgba(37,99,235,0.04)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <img src={market.icon} alt={market.symbol} className="w-8 h-8 rounded-full" />
            <div>
              <span className="text-white font-semibold text-sm">{market.symbol}</span>
              <span className="text-[#64748B] text-xs ml-2 hidden sm:inline">{market.name}</span>
            </div>
          </div>
          <span className="text-white text-sm font-medium text-right">{formatPrice(market.price)}</span>
          <span className={`text-sm font-medium text-right hidden sm:block ${market.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}%
          </span>
          <span className="text-[#94A3B8] text-sm text-right hidden sm:block">${market.volume}</span>
          <div className="hidden sm:flex justify-end">
            <MiniSparkline positive={market.change >= 0} />
          </div>
        </Link>
      ))}
    </motion.div>
  </section>
);

export default MarketsPreview;
