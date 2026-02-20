import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownLeft, ArrowUpRight, Repeat, Loader2, History, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import TransactionsHistory from '@/components/TransactionsHistory';
import { CRYPTO_PRICES } from '@/lib/cryptoPrices';

const Portfolio = () => {
    const { t } = useLanguage();
    const { formatCurrency, currency, exchangeRates } = useCurrency();
    const navigate = useNavigate();
    const { user, userProfile } = useAuth();
    const { toast } = useToast();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalValue, setTotalValue] = useState(0);

    const fetchPortfolioData = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        try {
            const [
                { data: balances, error: balanceError },
                { data: assetsData, error: assetsError }
            ] = await Promise.all([
                supabase.from('user_assets').select('symbol, amount').eq('user_id', user.id),
                supabase.from('assets').select('symbol, price, icon_url, name')
            ]);

            if (balanceError) throw balanceError;
            if (assetsError) throw assetsError;

            const prices = Object.entries(CRYPTO_PRICES).reduce((acc, [symbol, data]) => {
                acc[symbol] = { price: data.price, icon: data.icon_url, name: data.name };
                return acc;
            }, {});
            (assetsData || []).forEach(asset => {
                prices[asset.symbol] = { price: asset.price, icon: asset.icon_url, name: asset.name };
            });

            let totalPortfolioValueUSD = 0;
            const portfolioAssets = (balances || []).map(balance => {
                const priceInUSD = prices[balance.symbol]?.price || 0;
                const valueInUSD = balance.amount * priceInUSD;
                totalPortfolioValueUSD += valueInUSD;

                return {
                    symbol: balance.symbol,
                    name: prices[balance.symbol]?.name || balance.symbol,
                    amount: balance.amount,
                    value: valueInUSD,
                    price: priceInUSD,
                    logo: prices[balance.symbol]?.icon,
                };
            }).filter(asset => asset.amount > 0);

            setAssets(portfolioAssets);
            setTotalValue(totalPortfolioValueUSD);

        } catch (error) {
            console.error("Error fetching portfolio data:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch portfolio data.' });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        fetchPortfolioData();
        
        const channel = supabase.channel('realtime-portfolio')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'user_assets', filter: `user_id=eq.${user?.id}` }, () => {
            fetchPortfolioData();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'deposits', filter: `user_id=eq.${user?.id}` }, () => {
            fetchPortfolioData();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals', filter: `user_id=eq.${user?.id}` }, () => {
            fetchPortfolioData();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user?.id}` }, () => {
            fetchPortfolioData();
          })
          .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchPortfolioData, user?.id]);

    const getConvertedValue = (value) => {
        const rate = exchangeRates[currency.toLowerCase()] || 1;
        return value * rate;
    };

    return (
        <>
            <Helmet>
                <title>{t('portfolio')} - MetaTradeX</title>
            </Helmet>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">{t('portfolio')}</h1>
                        <p className="text-muted-foreground mt-2">An overview of your crypto assets and history.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => navigate('/deposit')}><ArrowDownLeft className="mr-2 h-4 w-4" />{t('deposit')}</Button>
                        <Button onClick={() => navigate('/withdraw')}><ArrowUpRight className="mr-2 h-4 w-4" />{t('withdraw')}</Button>
                        <Button variant="outline" onClick={() => navigate('/swap')}><Repeat className="mr-2 h-4 w-4" />{t('swap')}</Button>
                        {userProfile?.is_admin && (
                          <Button variant="secondary" onClick={() => navigate('/admin')}><Shield className="mr-2 h-4 w-4" />Admin</Button>
                        )}
                    </div>
                </div>

                <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 glowing-border mb-8">
                    <CardHeader>
                        <CardTitle className="text-muted-foreground font-normal">Total Portfolio Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold tracking-tight">{loading ? <Loader2 className="h-12 w-12 animate-spin" /> : formatCurrency(getConvertedValue(totalValue))}</p>
                    </CardContent>
                </Card>
                
                <Tabs defaultValue="assets" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="assets">Your Assets</TabsTrigger>
                        <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="assets">
                        {loading ? (
                            <div className="text-center p-10"><Loader2 className="mx-auto h-10 w-10 animate-spin" /></div>
                        ) : assets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {assets.map((asset) => (
                                    <Card key={asset.symbol} className="flex flex-col glassmorphic hover:border-primary transition-all">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <div className="flex items-center gap-3">
                                                {asset.logo && <img src={asset.logo} alt={asset.symbol} className="h-10 w-10" />}
                                                <div>
                                                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                                                    <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => navigate(`/trading/${asset.symbol.toLowerCase()}`)}>Trade</Button>
                                        </CardHeader>
                                        <CardContent className="flex-grow flex flex-col justify-end">
                                            <p className="text-2xl font-bold">{formatCurrency(getConvertedValue(asset.value))}</p>
                                            <p className="text-sm text-muted-foreground">{parseFloat(asset.amount).toFixed(6)} {asset.symbol} @ {formatCurrency(getConvertedValue(asset.price))}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 px-4 rounded-lg border-2 border-dashed">
                                <h3 className="text-xl font-semibold">Your portfolio is empty.</h3>
                                <p className="text-muted-foreground mt-2">Deposit funds to start your trading journey.</p>
                                <Button className="mt-4" onClick={() => navigate('/deposit')}>Deposit Now</Button>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="history">
                        <TransactionsHistory />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default Portfolio;