import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, LineStyle } from 'lightweight-charts';
import { useTheme } from '@/contexts/ThemeContext';
import { Loader2, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const TradingChart = ({ symbol, setLivePrice, isFullScreen = false }) => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { toast } = useToast();
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candlestickSeriesRef = useRef(null);
    const trendLinesRef = useRef([]);
    const [loading, setLoading] = useState(true);
    const lastCandleRef = useRef(null);
    const isComponentMounted = useRef(true);

    const applyTheme = useCallback(() => {
        if (!chartRef.current) return;
        const isDark = theme === 'dark';
        chartRef.current.applyOptions({
            layout: {
                background: { type: ColorType.Solid, color: isDark ? '#1a1e26' : '#ffffff' },
                textColor: isDark ? '#D1D4DC' : '#333',
            },
            grid: {
                vertLines: { color: isDark ? '#2A2E39' : '#E6E6E6' },
                horzLines: { color: isDark ? '#2A2E39' : '#E6E6E6' },
            },
        });
    }, [theme]);

    const drawRandomTrendLines = (data) => {
        if (!chartRef.current || !isComponentMounted.current || data.length < 20) return;

        trendLinesRef.current.forEach(line => {
            try { chartRef.current.removeSeries(line); } catch (e) { /* ignore disposed objects */ }
        });
        trendLinesRef.current = [];

        for (let i = 0; i < 3; i++) {
            const startIndex = Math.floor(Math.random() * (data.length - 10));
            const endIndex = startIndex + Math.floor(Math.random() * (data.length - startIndex - 5)) + 5;
            
            if(data[startIndex] && data[endIndex]) {
                const trendLineData = [
                    { time: data[startIndex].time, value: data[startIndex].low * (0.98 + Math.random() * 0.04) },
                    { time: data[endIndex].time, value: data[endIndex].close * (0.98 + Math.random() * 0.04) },
                ];
    
                const trendLine = chartRef.current.addLineSeries({
                    color: `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.7)`,
                    lineWidth: 1,
                    lineStyle: LineStyle.Dotted,
                    priceLineVisible: false,
                    lastValueVisible: false,
                });
                trendLine.setData(trendLineData);
                trendLinesRef.current.push(trendLine);
            }
        }
    };

    const fetchInitialData = useCallback(async () => {
        if (!isComponentMounted.current) return;
        setLoading(true);
        try {
            const end = Date.now();
            const start = end - 200 * 60 * 1000;

            const { data, error } = await supabase.functions.invoke('get-livecoinwatch-data', {
                body: { symbol, start, end },
            });
            
            if (!isComponentMounted.current) return;

            if (error) {
                const errorBody = await error.context.json();
                throw new Error(errorBody.error || error.message);
            }
            if (!data) throw new Error("No data returned from API");
            
            if (data.length === 0) {
                 if (setLivePrice) setLivePrice(0);
                 if (candlestickSeriesRef.current) candlestickSeriesRef.current.setData([]);
                 console.warn("No historical data returned for symbol:", symbol);
                 return;
            }

            const formattedData = data.map(d => ({
                time: d.time,
                open: d.rate,
                high: d.rate,
                low: d.rate,
                close: d.rate,
            }));

            if (candlestickSeriesRef.current) {
                candlestickSeriesRef.current.setData(formattedData);
                drawRandomTrendLines(formattedData);
            }
            
            if (formattedData.length > 0) {
                lastCandleRef.current = formattedData[formattedData.length - 1];
                if (setLivePrice) {
                    setLivePrice(lastCandleRef.current.close);
                }
            }
            
            chartRef.current.timeScale().fitContent();

        } catch (error) {
            if (!isComponentMounted.current) return;
            console.error("Chart data fetch error:", error);
            if(error.message.includes('API key')) {
                toast({
                    variant: 'destructive',
                    title: 'Live Data Error',
                    description: 'The LiveCoinWatch API key is not set. Please get a free key from livecoinwatch.com and set it in your Supabase secrets.',
                    duration: 10000,
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Chart Error',
                    description: `Could not load chart data for ${symbol.toUpperCase()}.`,
                });
            }
        } finally {
            if (isComponentMounted.current) {
                setLoading(false);
            }
        }
    }, [symbol, setLivePrice, toast]);

    useEffect(() => {
        isComponentMounted.current = true;
        if (!chartContainerRef.current) return;

        chartRef.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            rightPriceScale: { borderColor: theme === 'dark' ? '#3A404D' : '#C8C8C8' },
            timeScale: { borderColor: theme === 'dark' ? '#3A404D' : '#C8C8C8', timeVisible: true, secondsVisible: true },
            crosshair: { mode: 1 },
            watermark: {
                color: 'rgba(11, 94, 215, 0.1)',
                visible: true,
                text: ` ${symbol.toUpperCase()} / USD`,
                fontSize: 48,
                horzAlign: 'center',
                vertAlign: 'center',
            },
        });

        candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderDownColor: '#ef5350',
            borderUpColor: '#26a69a', wickDownColor: '#ef5350', wickUpColor: '#26a69a',
        });

        fetchInitialData();
        applyTheme();

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        const liveUpdateInterval = setInterval(() => {
            if (lastCandleRef.current && isComponentMounted.current) {
                const change = (Math.random() - 0.5) * (lastCandleRef.current.close * 0.001);
                const open = lastCandleRef.current.close;
                const close = open + change;
                const high = Math.max(open, close) + Math.random() * (lastCandleRef.current.close * 0.0005);
                const low = Math.min(open, close) - Math.random() * (lastCandleRef.current.close * 0.0005);
                const nextCandle = { time: Math.floor(Date.now() / 1000), open, high, low, close };
                
                if (candlestickSeriesRef.current) {
                    candlestickSeriesRef.current.update(nextCandle);
                }
                if (setLivePrice) {
                    setLivePrice(nextCandle.close);
                }
                lastCandleRef.current = nextCandle;
            }
        }, 2000);

        return () => {
            isComponentMounted.current = false;
            clearInterval(liveUpdateInterval);
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [symbol, fetchInitialData, applyTheme]);

    useEffect(() => {
        applyTheme();
    }, [theme, applyTheme]);

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-background/70 backdrop-blur-sm p-1 rounded-md">
                 <span className="p-2 text-sm font-semibold">LIVE</span>
                {!isFullScreen && (
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/charting/${symbol}`)}>
                        <Expand className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div ref={chartContainerRef} className="w-full h-full" />
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-background/50">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
            )}
        </div>
    );
};

export default TradingChart;