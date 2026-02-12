import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CoinSwapper = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const { user } = useAuth();
    const [cryptos, setCryptos] = useState([]);
    const [fromCoin, setFromCoin] = useState('');
    const [toCoin, setToCoin] = useState('');
    const [fromAmount, setFromAmount] = useState(1);
    const [toAmount, setToAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [balances, setBalances] = useState({});

    const fetchAssetsAndBalances = useCallback(async () => {
        setLoading(true);
        try {
            const [
                { data: assetsData, error: assetsError },
                { data: balancesData, error: balancesError }
            ] = await Promise.all([
                supabase.from('mock_assets').select('*'),
                supabase.from('balances').select('currency, amount').eq('user_id', user.id)
            ]);

            if (assetsError) throw assetsError;
            if (balancesError) throw balancesError;

            setCryptos(assetsData);
            if (assetsData.length > 1) {
                setFromCoin(assetsData[0].symbol);
                setToCoin(assetsData[1].symbol);
            }

            const balancesMap = balancesData.reduce((acc, bal) => {
                acc[bal.currency] = bal.amount;
                return acc;
            }, {});
            setBalances(balancesMap);

        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load necessary data.' });
        } finally {
            setLoading(false);
        }
    }, [toast, user.id]);

    useEffect(() => {
        fetchAssetsAndBalances();
    }, [fetchAssetsAndBalances]);
    
    useEffect(() => {
        if (cryptos.length > 0 && fromAmount > 0 && fromCoin && toCoin) {
            const from = cryptos.find(c => c.symbol === fromCoin);
            const to = cryptos.find(c => c.symbol === toCoin);
            if (from && to) {
                const result = (from.price / to.price) * fromAmount;
                setToAmount(result.toFixed(8));
            }
        } else {
            setToAmount(0);
        }
    }, [fromCoin, toCoin, fromAmount, cryptos]);

    const handleSwap = async () => {
        setLoading(true);
        const fromBalance = balances[fromCoin] || 0;
        if (fromAmount > fromBalance) {
            toast({ variant: 'destructive', title: 'Insufficient Balance', description: `You don't have enough ${fromCoin}.` });
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.rpc('swap_assets', {
                p_user_id: user.id,
                p_from_currency: fromCoin,
                p_to_currency: toCoin,
                p_from_amount: fromAmount,
                p_to_amount: toAmount
            });

            if (error) throw error;

            toast({ title: 'Swap Successful!', description: `You swapped ${fromAmount} ${fromCoin} for ${toAmount} ${toCoin}.` });
            fetchAssetsAndBalances();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Swap Failed', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const flipCoins = () => {
        const tempCoin = fromCoin;
        setFromCoin(toCoin);
        setToCoin(tempCoin);
    };

    return (
        <>
            <Helmet><title>{t('swap')} - MetaTradeX</title></Helmet>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Card className="w-full max-w-md glassmorphic">
                    <CardHeader><CardTitle className="text-center text-3xl font-bold">{t('swap')}</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>From</Label>
                                <span className="text-xs text-muted-foreground">Balance: {balances[fromCoin]?.toFixed(4) || '0.00'}</span>
                            </div>
                            <div className="flex gap-2">
                                <Input type="number" value={fromAmount} onChange={e => setFromAmount(e.target.value)} className="w-2/3" />
                                <Select value={fromCoin} onValueChange={setFromCoin}>
                                    <SelectTrigger className="w-1/3"><SelectValue /></SelectTrigger>
                                    <SelectContent>{cryptos.map(c => <SelectItem key={c.symbol} value={c.symbol}>{c.symbol}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button variant="ghost" size="icon" onClick={flipCoins}><ArrowRightLeft className="h-5 w-5 text-muted-foreground" /></Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>To</Label>
                                <span className="text-xs text-muted-foreground">Balance: {balances[toCoin]?.toFixed(4) || '0.00'}</span>
                            </div>
                            <div className="flex gap-2">
                                <Input type="number" value={toAmount} readOnly className="w-2/3 bg-muted" />
                                <Select value={toCoin} onValueChange={setToCoin}>
                                    <SelectTrigger className="w-1/3"><SelectValue /></SelectTrigger>
                                    <SelectContent>{cryptos.map(c => <SelectItem key={c.symbol} value={c.symbol}>{c.symbol}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={handleSwap} className="w-full !mt-8" size="lg" disabled={loading || !fromAmount || fromAmount <= 0}>
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Swapping...</> : 'Swap Coins'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default CoinSwapper;