import { useState, useEffect, useRef } from 'react';
import { CRYPTO_PRICES } from '@/lib/cryptoPrices';

const INITIAL_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: CRYPTO_PRICES.BTC.icon_url, basePrice: CRYPTO_PRICES.BTC.price, volume: 2100000000 },
  { symbol: 'ETH', name: 'Ethereum', icon: CRYPTO_PRICES.ETH.icon_url, basePrice: CRYPTO_PRICES.ETH.price, volume: 980000000 },
  { symbol: 'XRP', name: 'Ripple', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', basePrice: 1.42, volume: 340000000 },
  { symbol: 'USDC', name: 'USD Coin', icon: CRYPTO_PRICES.USDC.icon_url, basePrice: CRYPTO_PRICES.USDC.price, volume: 5200000000 },
  { symbol: 'SOL', name: 'Solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', basePrice: 83.58, volume: 520000000 },
  { symbol: 'USDT', name: 'Tether', icon: CRYPTO_PRICES.USDT.icon_url, basePrice: CRYPTO_PRICES.USDT.price, volume: 48000000000 },
];

const INITIAL_STOCKS = { symbol: 'NVDA', basePrice: 187.877 };
const INITIAL_TRADFI = { symbol: 'Gold', basePrice: 5023.05 };

function jitter(base, maxPct) {
  const pct = (Math.random() - 0.5) * 2 * maxPct;
  return base * (1 + pct / 100);
}

function randomChange(prev, maxDelta) {
  const delta = (Math.random() - 0.5) * 2 * maxDelta;
  return Math.round((prev + delta) * 100) / 100;
}

function buildInitial() {
  const assets = INITIAL_ASSETS.map((a) => ({
    ...a,
    price: a.basePrice,
    change: Math.round((Math.random() - 0.3) * 6 * 100) / 100,
  }));

  const stock = {
    symbol: INITIAL_STOCKS.symbol,
    price: INITIAL_STOCKS.basePrice,
    change: Math.round((Math.random() - 0.5) * 2 * 100) / 100,
  };

  const tradfi = {
    symbol: INITIAL_TRADFI.symbol,
    price: INITIAL_TRADFI.basePrice,
    change: Math.round((Math.random() - 0.3) * 3 * 100) / 100,
  };

  return { assets, stock, tradfi };
}

function tick(prev) {
  const assets = prev.assets.map((a) => {
    const volatility = a.symbol === 'USDT' || a.symbol === 'USDC' ? 0.005 : 0.15;
    const changeDelta = a.symbol === 'USDT' || a.symbol === 'USDC' ? 0.02 : 0.35;
    return {
      ...a,
      price: jitter(a.basePrice, volatility),
      change: randomChange(a.change, changeDelta),
    };
  });

  const stock = {
    ...prev.stock,
    price: jitter(INITIAL_STOCKS.basePrice, 0.12),
    change: randomChange(prev.stock.change, 0.25),
  };

  const tradfi = {
    ...prev.tradfi,
    price: jitter(INITIAL_TRADFI.basePrice, 0.08),
    change: randomChange(prev.tradfi.change, 0.2),
  };

  return { assets, stock, tradfi };
}

export function useTickerData(intervalMs = 2000) {
  const [data, setData] = useState(buildInitial);

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => tick(prev));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return data;
}
