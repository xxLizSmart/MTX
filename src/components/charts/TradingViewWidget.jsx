import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const TradingViewWidget = ({ symbol, assetType = 'crypto' }) => {
  const container = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!container.current || container.current.querySelector('script')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    let tradingViewSymbol;
    let tradingViewCopyrightLink;

    if (assetType === 'stock') {
        tradingViewSymbol = `NASDAQ:${symbol.toUpperCase()}`;
        tradingViewCopyrightLink = `https://www.tradingview.com/symbols/NASDAQ-${symbol.toUpperCase()}/?exchange=NASDAQ`
    } else {
        tradingViewSymbol = `BINANCE:${symbol.toUpperCase()}USDT`;
        tradingViewCopyrightLink = `https://www.tradingview.com/symbols/BINANCE-${symbol.toUpperCase()}USDT/?exchange=BINANCE`
    }

    const config = {
      "allow_symbol_change": true,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": false,
      "hotlist": false,
      "interval": "D",
      "locale": "en",
      "save_image": true,
      "style": "1",
      "symbol": tradingViewSymbol,
      "theme": theme,
      "timezone": "Etc/UTC",
      "backgroundColor": theme === 'dark' ? "#0F0F0F" : "hsl(240, 10%, 99%)",
      "gridColor": theme === 'dark' ? "rgba(242, 242, 242, 0.06)" : "rgba(42, 46, 57, 0.06)",
      "watchlist": [],
      "withdateranges": false,
      "compareSymbols": [],
      "studies": [
        "STD;Bollinger_Bands"
      ],
      "autosize": true
    };

    script.innerHTML = JSON.stringify(config);
    
    // Clear the container before appending the new script
    while (container.current.firstChild) {
      container.current.removeChild(container.current.firstChild);
    }
    container.current.appendChild(script);

    // No need to hack the copyright link anymore, the widget handles it.
  }, [symbol, theme, assetType]);

  // The copyright and widget containers are now created by the script.
  return (
    <div className="tradingview-widget-container" style={{ height: "100%", width: "100%" }} ref={container}>
      <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}

export default memo(TradingViewWidget);