import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { CRYPTO_PRICES } from '@/lib/cryptoPrices';

const stocksData = [
  { symbol: 'NVDA', change: -0.04, price: '187.877' },
];

const tradFiData = [
  { symbol: 'Gold', change: 0.49, price: '5,023.05' },
];

const popularAssets = [
  { symbol: 'BTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', price: CRYPTO_PRICES.BTC.price, change: 0.99 },
  { symbol: 'ETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', price: CRYPTO_PRICES.ETH.price, change: -1.23 },
  { symbol: 'XRP', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', price: 1.42, change: -0.46 },
  { symbol: 'USDC', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', price: CRYPTO_PRICES.USDC.price, change: 0.00 },
  { symbol: 'SOL', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', price: 83.58, change: 1.21 },
];

const formatPrice = (price) => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const MiniChart = ({ color = '#22c55e' }) => (
  <svg viewBox="0 0 60 30" className="w-12 h-6" fill="none">
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

const GlassCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={`rounded-2xl border border-[#1E293B] bg-[rgba(20,24,45,0.7)] backdrop-blur-[16px] ${className}`}
  >
    {children}
  </motion.div>
);

const NewHero = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <section className="relative hidden sm:block w-full min-h-[calc(100vh-5rem)] overflow-hidden" style={{ background: 'linear-gradient(165deg, #0B0E1E 0%, #15192C 50%, #0B0E1E 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.08]" viewBox="0 0 800 800" fill="none">
          <path d="M400 100 C600 150 700 300 650 500 C600 700 350 750 200 650 C50 550 0 350 100 200 C200 50 350 50 400 100Z" stroke="#2563EB" strokeWidth="1.5" fill="none" />
          <path d="M420 130 C610 175 690 320 645 490 C600 660 370 710 230 620 C90 530 40 360 130 220 C220 80 370 75 420 130Z" stroke="#1D4ED8" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center pt-4 lg:pt-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.1] tracking-tight text-white">
              Beyond crypto.{' '}
              <br className="hidden sm:block" />
              Trade global assets{' '}
              <br className="hidden sm:block" />
              with USDT.
            </h1>

            <p className="mt-6 text-[#94A3B8] text-base sm:text-lg leading-relaxed max-w-lg">
              Sign up now to claim a welcome pack worth{' '}
              <span className="text-[#2563EB] font-semibold">6200 USDT</span>
            </p>

            <form onSubmit={handleStart} className="mt-8 flex items-center max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email/Phone number"
                  className="w-full h-12 pl-4 pr-4 rounded-l-lg bg-[#141824] border border-[#1E293B] border-r-0 text-white placeholder-[#64748B] text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-6 sm:px-8 rounded-r-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm whitespace-nowrap transition-colors"
              >
                Start now
              </button>
            </form>

            <div className="mt-8 flex items-center gap-6 text-[#64748B] text-xs">
              <span>Or continue with</span>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#141824] border border-[#1E293B] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#94A3B8]"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#141824] border border-[#1E293B] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#94A3B8]"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:pt-4">
            <div className="flex flex-col gap-4 flex-1">
              <GlassCard delay={0.2} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold text-sm">Stocks</span>
                  <MiniChart color="#ef4444" />
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[#94A3B8] text-xs">{stocksData[0].symbol}</span>
                  <span className={`text-xs ${stocksData[0].change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stocksData[0].change >= 0 ? '+' : ''}{stocksData[0].change}%
                  </span>
                </div>
                <p className="text-white text-3xl font-bold tracking-tight">{stocksData[0].price}</p>
                <Link to="/assets" className="mt-3 text-[#94A3B8] text-xs hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              </GlassCard>

              <GlassCard delay={0.35} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold text-sm">TradFi</span>
                  <MiniChart color="#22c55e" />
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[#94A3B8] text-xs">{tradFiData[0].symbol}</span>
                  <span className={`text-xs ${tradFiData[0].change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    +{tradFiData[0].change}%
                  </span>
                </div>
                <p className="text-white text-3xl font-bold tracking-tight">{tradFiData[0].price}</p>
                <Link to="/assets" className="mt-3 text-[#94A3B8] text-xs hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              </GlassCard>
            </div>

            <GlassCard delay={0.5} className="p-5 flex-1 sm:min-w-[240px]">
              <span className="text-white font-semibold text-sm mb-4 block">Popular</span>
              <div className="space-y-3">
                {popularAssets.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={asset.icon} alt={asset.symbol} className="w-6 h-6 rounded-full" />
                      <span className="text-white text-sm font-medium">{asset.symbol}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-medium">{formatPrice(asset.price)}</p>
                      <p className={`text-xs ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/assets" className="mt-4 text-[#94A3B8] text-xs hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
                Explore over 100 assets <ArrowRight className="w-3 h-3" />
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHero;
