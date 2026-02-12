import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

const currencies = {
  USD: { symbol: '$', name: 'USD' },
  EUR: { symbol: '€', name: 'EUR' },
  GBP: { symbol: '£', name: 'GBP' },
  JPY: { symbol: '¥', name: 'JPY' },
  NZD: { symbol: '$', name: 'NZD' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return saved && currencies[saved] ? saved : 'USD';
  });
  const [exchangeRates, setExchangeRates] = useState({ usd: 1 });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/exchange_rates?x_cg_demo_api_key=CG-QSQc3jW1Mxdj9tpxPz3P51GN');
        if (!response.ok) throw new Error('Failed to fetch rates');
        const data = await response.json();
        const rates = { usd: 1 };
        Object.keys(currencies).forEach(key => {
            const lowerKey = key.toLowerCase();
            if(data.rates[lowerKey]) {
                rates[lowerKey] = data.rates[lowerKey].value / data.rates.usd.value;
            }
        });
        setExchangeRates(rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        setExchangeRates({
            usd: 1,
            eur: 1 / 1.08,
            gbp: 1 / 1.25,
            jpy: 1 / 0.0064,
            nzd: 1 / 0.61,
        });
      }
    };
    fetchRates();
  }, []);
  
  const formatCurrency = useCallback((value, fromCurrency = 'USD') => {
    if (typeof value !== 'number') {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(0);
    }
    const fromRate = exchangeRates[fromCurrency.toLowerCase()] || 1;
    const toRate = exchangeRates[currency.toLowerCase()] || 1;
    const convertedValue = (value / fromRate) * toRate;

    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedValue);
  }, [currency, exchangeRates]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencies, formatCurrency, exchangeRates }}>
      {children}
    </CurrencyContext.Provider>
  );
};