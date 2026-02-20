import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CRYPTO_PRICES } from '@/lib/cryptoPrices';

const formatPrice = (price) =>
  price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

const popularAssets = [
  { symbol: 'BTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', price: CRYPTO_PRICES.BTC.price, change: 0.99 },
  { symbol: 'ETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', price: CRYPTO_PRICES.ETH.price, change: -1.23 },
  { symbol: 'USDC', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', price: CRYPTO_PRICES.USDC.price, change: 0.00 },
];

const MobileHero = () => {
  return (
    <motion.section
      className="relative block sm:hidden w-full overflow-hidden px-4 pt-8 pb-12"
      style={{ background: 'linear-gradient(165deg, #0B0E1E 0%, #15192C 50%, #0B0E1E 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold leading-tight text-white tracking-tight">
        Beyond crypto.<br />Trade global assets<br />with USDT.
      </h1>
      <p className="mt-4 text-[#94A3B8] text-sm">
        Sign up now to claim a welcome pack worth{' '}
        <span className="text-[#2563EB] font-semibold">6200 USDT</span>
      </p>

      <Link
        to="/register"
        className="mt-6 block w-full h-12 rounded-lg bg-[#2563EB] text-white font-semibold text-sm text-center leading-[3rem]"
      >
        Start now
      </Link>

      <div className="mt-8 rounded-2xl border border-[#1E293B] bg-[rgba(20,24,45,0.7)] backdrop-blur-[16px] p-4">
        <span className="text-white font-semibold text-sm mb-3 block">Popular</span>
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
      </div>
    </motion.section>
  );
};

export default MobileHero;
