const STORAGE_KEYS = {
  USER: 'metatradex_user',
  BALANCES: 'metatradex_balances',
  DEPOSITS: 'metatradex_deposits',
  WITHDRAWALS: 'metatradex_withdrawals',
  TRANSACTIONS: 'metatradex_transactions',
  ASSETS: 'metatradex_assets',
  NOTIFICATIONS: 'metatradex_notifications',
  REFERRALS: 'metatradex_referrals',
  TRADE_SETTINGS: 'metatradex_trade_settings',
  USERS: 'metatradex_users',
};

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

export const initializeDefaultData = () => {
  if (!storage.get(STORAGE_KEYS.ASSETS)) {
    storage.set(STORAGE_KEYS.ASSETS, [
      {
        id: 1,
        symbol: 'btc',
        name: 'Bitcoin',
        price: 45000,
        icon_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        price_change_percentage_24h: 2.5
      },
      {
        id: 2,
        symbol: 'eth',
        name: 'Ethereum',
        price: 2500,
        icon_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        price_change_percentage_24h: 1.8
      },
      {
        id: 3,
        symbol: 'usdt',
        name: 'Tether',
        price: 1,
        icon_url: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
        price_change_percentage_24h: 0.1
      },
      {
        id: 4,
        symbol: 'bnb',
        name: 'Binance Coin',
        price: 320,
        icon_url: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
        price_change_percentage_24h: 3.2
      }
    ]);
  }

  if (!storage.get(STORAGE_KEYS.TRADE_SETTINGS)) {
    storage.set(STORAGE_KEYS.TRADE_SETTINGS, [
      { id: 1, duration: 30, win_rate: 0.85, loss_rate: 0.95, min_capital: 10 },
      { id: 2, duration: 60, win_rate: 0.90, loss_rate: 0.95, min_capital: 20 },
      { id: 3, duration: 120, win_rate: 0.95, loss_rate: 0.95, min_capital: 50 },
      { id: 4, duration: 300, win_rate: 1.00, loss_rate: 0.95, min_capital: 100 }
    ]);
  }

  if (!storage.get(STORAGE_KEYS.USERS)) {
    storage.set(STORAGE_KEYS.USERS, []);
  }
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateReferralCode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

export { STORAGE_KEYS };