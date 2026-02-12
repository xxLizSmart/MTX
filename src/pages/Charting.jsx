import React from 'react';
import { useParams } from 'react-router-dom';
import TradingChart from '@/components/charts/TradingChart';
import { Helmet } from 'react-helmet';

const Charting = () => {
    const { symbol } = useParams();

    return (
        <>
            <Helmet>
                <title>Chart | {symbol.toUpperCase()} - MetaTradeX</title>
            </Helmet>
            <div className="w-full h-screen bg-background">
                <TradingChart symbol={symbol} isFullScreen={true} />
            </div>
        </>
    );
};

export default Charting;