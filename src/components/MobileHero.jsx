import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTickerData } from '@/lib/useTickerData';

const formatPrice = (price) =>
  price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatPriceCompact = (price) => {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toFixed(3);
};

const MiniChart = ({ color = '#22c55e' }) => (
  <svg viewBox="0 0 60 30" className="w-10 h-5" fill="none">
    <path
      d={color === '#22c55e'
        ? 'M2 24 L8 20 L14 22 L20 16 L26 18 L32 12 L38 14 L44 8 L50 10 L56 4'
        : 'M2 6 L8 10 L14 8 L20 14 L26 12 L32 18 L38 16 L44 22 L50 20 L56 26'}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MobileHero = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { assets, stock, tradfi } = useTickerData(2000);
  const popularAssets = assets.slice(0, 4);

  const handleStart = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <motion.section
      className="relative block sm:hidden w-full overflow-hidden px-6 pt-8 pb-12"
      style={{ background: 'linear-gradient(165deg, #0B0E1E 0%, #15192C 50%, #0B0E1E 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold leading-tight text-white tracking-tight">
        Beyond crypto.<br />Trade global assets<br />with USDT.
      </h1>
      <p className="mt-4 text-[#94A3B8] text-sm leading-relaxed">
        Sign up now to claim a welcome pack worth{' '}
        <span className="text-[#2563EB] font-semibold">6200 USDT</span>
      </p>

      <form onSubmit={handleStart} className="mt-6 flex items-center">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email/Phone number"
          className="flex-1 h-12 pl-4 pr-4 rounded-l-lg bg-[#141824] border border-[#1E293B] border-r-0 text-white placeholder-[#64748B] text-[16px] focus:outline-none focus:border-[#2563EB] transition-colors"
        />
        <button
          type="submit"
          className="h-12 px-6 rounded-r-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm whitespace-nowrap transition-colors min-h-[44px]"
        >
          Start now
        </button>
      </form>

      <div className="mt-8 -mx-6 px-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 w-max">
          <div className="rounded-2xl border border-[#1E293B] bg-[rgba(20,24,45,0.7)] backdrop-blur-[16px] p-4 w-[160px] shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-xs">Stocks</span>
              <MiniChart color={stock.change >= 0 ? '#22c55e' : '#ef4444'} />
            </div>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="text-[#94A3B8] text-[10px]">{stock.symbol}</span>
              <span className={`text-[10px] ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
              </span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">
              {formatPriceCompact(stock.price)}
            </span>
          </div>

          <div className="rounded-2xl border border-[#1E293B] bg-[rgba(20,24,45,0.7)] backdrop-blur-[16px] p-4 w-[160px] shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-xs">TradFi</span>
              <MiniChart color={tradfi.change >= 0 ? '#22c55e' : '#ef4444'} />
            </div>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="text-[#94A3B8] text-[10px]">{tradfi.symbol}</span>
              <span className={`text-[10px] ${tradfi.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tradfi.change >= 0 ? '+' : ''}{tradfi.change.toFixed(2)}%
              </span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">
              {formatPriceCompact(tradfi.price)}
            </span>
          </div>

          <div className="rounded-2xl border border-[#1E293B] bg-[rgba(20,24,45,0.7)] backdrop-blur-[16px] p-4 w-[200px] shrink-0">
            <span className="text-white font-semibold text-xs mb-2.5 block">Popular</span>
            <div className="space-y-2">
              {popularAssets.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={asset.icon} alt={asset.symbol} className="w-5 h-5 rounded-full shrink-0" />
                    <span className="text-white text-xs font-medium">{asset.symbol}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-white text-xs font-medium">{formatPrice(asset.price)}</span>
                    <span className={`block text-[10px] ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/assets" className="mt-2.5 text-[#94A3B8] text-[10px] hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
              Explore assets <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MobileHero;
