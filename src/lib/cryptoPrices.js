export const CRYPTO_PRICES = {
  BTC: { name: 'Bitcoin', price: 67281.30, icon_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  ETH: { name: 'Ethereum', price: 1954.37, icon_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  USDT: { name: 'Tether', price: 0.9994, icon_url: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
  USDC: { name: 'USD Coin', price: 1.012, icon_url: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
};

export function getCryptoPrice(symbol) {
  return CRYPTO_PRICES[symbol?.toUpperCase()]?.price || 0;
}

export function getCryptoPriceMap() {
  return Object.entries(CRYPTO_PRICES).reduce((acc, [symbol, data]) => {
    acc[symbol] = data.price;
    acc[symbol.toLowerCase()] = data.price;
    return acc;
  }, {});
}
