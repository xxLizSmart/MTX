import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import TransactionsHistory from '@/components/TransactionsHistory';
import TradingViewWidget from '@/components/charts/TradingViewWidget';
import { useCurrency } from '@/contexts/CurrencyContext';

const Trading = () => {
    const { symbol = 'btc' } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { toast } = useToast();
    const { user, userProfile } = useAuth();
    const { formatCurrency } = useCurrency();
    const [isKycVerified, setIsKycVerified] = useState(false);
    
    const [cryptoAssets, setCryptoAssets] = useState({});
    const [activeSymbol, setActiveSymbol] = useState(symbol);
    const [isTrading, setIsTrading] = useState(false);
    const [tradeDuration, setTradeDuration] = useState('30');
    const [timeLeft, setTimeLeft] = useState(0);
    const [tradeResult, setTradeResult] = useState(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [balances, setBalances] = useState([]);
    const [selectedBalanceCurrency, setSelectedBalanceCurrency] = useState('USDT');
    const [loading, setLoading] = useState(true);
    const [tradeSettings, setTradeSettings] = useState({});
    
    const [refreshHistory, setRefreshHistory] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(0);

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const [
                { data: assetsData, error: assetsError },
                { data: settingsData, error: settingsError }
            ] = await Promise.all([
                supabase.from('assets').select('name, symbol, price, icon_url'),
                supabase.from('trade_settings').select('*')
            ]);
            
            if (assetsError) throw new Error(`Assets Error: ${assetsError.message}`);
            if (settingsError && settingsError.code !== '42P01') throw new Error(`Settings Error: ${settingsError.message}`);

            const assetsMap = (assetsData || []).reduce((acc, asset) => {
                acc[asset.symbol.toLowerCase()] = { name: asset.name, price: asset.price, icon: asset.icon_url };
                return acc;
            }, {});
            setCryptoAssets(assetsMap);

            const settingsMap = (settingsData || []).reduce((acc, setting) => {
                acc[setting.duration] = setting;
                return acc;
            }, {});
            setTradeSettings(settingsMap);

            if(userProfile) setIsKycVerified(userProfile.kyc_status === 'approved');

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Initialization Error', description: error.message });
        } finally {
            setLoading(false);
        }
    }, [toast, userProfile]);

    const fetchBalances = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase.from('user_assets').select('symbol, amount').eq('user_id', user.id);
        if (error) {
            toast({ variant: 'destructive', title: 'Failed to fetch balances', description: error.message });
        } else {
            const formattedBalances = data.map(b => ({ currency: b.symbol, amount: b.amount }));
            setBalances(formattedBalances);
            const usdtBalance = formattedBalances.find(b => b.currency === 'USDT');
            if (usdtBalance) {
                setSelectedBalanceCurrency('USDT');
            } else if(formattedBalances.length > 0) {
                setSelectedBalanceCurrency(formattedBalances[0].currency);
            }
        }
    }, [user, toast]);
    
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        if (Object.keys(cryptoAssets).length > 0) {
            fetchBalances();
        }
    }, [cryptoAssets, fetchBalances]);
    
    useEffect(() => {
        let timer;
        if (isTrading && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (isTrading && timeLeft === 0) {
            endTrade();
        }
        return () => clearInterval(timer);
    }, [isTrading, timeLeft]);

    const startTrade = (type) => {
        if (!isKycVerified) {
            toast({ variant: 'destructive', title: 'KYC Required', description: 'Please complete KYC verification to start trading.' });
            return;
        }
        const tradeAmount = parseFloat(amount);
        const balance = balances.find(b => b.currency === selectedBalanceCurrency)?.amount || 0;
        const selectedOption = tradeSettings[tradeDuration];

        if (!tradeAmount || tradeAmount <= 0) { toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid amount.'}); return; }
        if (selectedOption && tradeAmount < selectedOption.min_capital) { toast({ variant: 'destructive', title: 'Capital Too Low', description: `Minimum capital for ${tradeDuration}s is ${selectedOption.min_capital} ${selectedBalanceCurrency}.` }); return; }
        if (tradeAmount > balance) { toast({ variant: 'destructive', title: 'Insufficient Balance', description: `You do not have enough ${selectedBalanceCurrency}.` }); return; }

        setIsTrading(true);
        setTimeLeft(parseInt(tradeDuration));
        
        toast({ title: 'Trade Started!', description: `You placed a ${type} trade for ${tradeAmount} ${selectedBalanceCurrency} over ${tradeDuration} seconds.` });
    };

    const endTrade = async () => {
        setIsTrading(false);
        const selectedOption = tradeSettings[tradeDuration];
        const tradeAmount = parseFloat(amount);
        
        let win;
        
        const { data: currentUser, error: userError } = await supabase.from('profiles').select('trade_override_status').eq('id', user.id).single();

        if (userError) {
             console.error("User fetch error", userError);
        }

        if (currentUser && currentUser.trade_override_status) {
            win = currentUser.trade_override_status === 'win';
        } else {
            const randomFactor = Math.random();
            win = randomFactor < (selectedOption?.win_rate || 0.5);
        }
        
        const profitOrLoss = win ? tradeAmount * (selectedOption?.win_rate || 0.8) : -(tradeAmount * (selectedOption?.loss_rate || 1));

        const { error: txError } = await supabase.from('transactions').insert({
            user_id: user.id,
            type: 'trade',
            status: win ? 'win' : 'loss',
            from_symbol: selectedBalanceCurrency,
            to_symbol: selectedBalanceCurrency,
            from_amount: tradeAmount,
            to_amount: profitOrLoss,
            fee: 0,
            price: cryptoAssets[activeSymbol]?.price || 0,
            notes: `${tradeDuration}s trade on ${activeSymbol.toUpperCase()} - ${win ? 'WIN' : 'LOSS'}`
        });

        if (txError) console.error("Transaction log error", txError);

        const { data: currentAsset } = await supabase.from('user_assets').select('*').eq('user_id', user.id).eq('symbol', selectedBalanceCurrency).maybeSingle();

        if (currentAsset) {
            const newAmount = Math.max(0, parseFloat(currentAsset.amount) + profitOrLoss);
            await supabase.from('user_assets').update({ amount: newAmount }).eq('id', currentAsset.id);
        } else {
            if (profitOrLoss > 0) {
                await supabase.from('user_assets').insert({ user_id: user.id, symbol: selectedBalanceCurrency, amount: profitOrLoss });
            }
        }

        setTradeResult({ win, profit: profitOrLoss, currency: selectedBalanceCurrency });
        setIsResultModalOpen(true);
        fetchBalances();
        setRefreshHistory(prev => !prev);
    };

    const isStock = (symbol) => {
        return ['aapl', 'tsla', 'googl'].includes(symbol.toLowerCase());
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-10 w-10 animate-spin"/></div>;
    }

    return (
        <>
            <Helmet><title>{`${t('trading')} ${activeSymbol.toUpperCase()} - MetaTradeX`}</title></Helmet>
            <div className="bg-transparent text-foreground p-2 sm:p-4">
               
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 lg:col-span-9">
                        <Card className="glassmorphic overflow-hidden p-0">
                           <div className="p-4 border-b border-border/50 flex items-center gap-4">
                                {cryptoAssets[activeSymbol]?.icon && <img src={cryptoAssets[activeSymbol].icon} alt={activeSymbol} className="w-8 h-8" />}
                                <h2 className="text-xl font-bold">{cryptoAssets[activeSymbol]?.name || activeSymbol.toUpperCase()} ({activeSymbol.toUpperCase()})</h2>
                           </div>
                           <div className="h-[calc(75vh-80px)] w-full">
                                <TradingViewWidget key={activeSymbol} symbol={activeSymbol} assetType={isStock(activeSymbol) ? 'stock' : 'crypto'} />
                           </div>
                        </Card>
                    </div>
                    <div className="col-span-12 lg:col-span-3 space-y-4">
                          <Card className="glassmorphic">
                            <CardHeader>
                                <CardTitle>Trade Panel</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!isKycVerified && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-400/10 text-yellow-500 border border-yellow-400/20">
                                        <AlertTriangle className="h-5 w-5"/>
                                        <p className="text-xs">KYC required for trading.</p>
                                        <Button size="sm" variant="link" className="p-0 h-auto text-yellow-500" onClick={()=>navigate('/kyc')}>Verify Now</Button>
                                    </div>
                                )}
                                {isTrading && <div className="text-center"><p className="text-muted-foreground">Time Remaining</p><p className="text-4xl font-bold font-mono">{timeLeft}s</p></div>}
                                
                                <div><Label>Select Asset</Label><Select value={activeSymbol} onValueChange={(v) => { setActiveSymbol(v); navigate(`/trading/${v}`)}} disabled={isTrading}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>{Object.entries(cryptoAssets).map(([sym, asset]) => ( <SelectItem key={sym} value={sym}>{asset.name} ({sym.toUpperCase()})</SelectItem>))}</SelectContent>
                                </Select></div>
                                
                                <div>
                                    <Label>Duration</Label>
                                    <div className="grid grid-cols-4 gap-2 mt-2">
                                        {Object.keys(tradeSettings).sort((a,b) => parseInt(a)-parseInt(b)).map(d => (
                                            <Button key={d} variant={tradeDuration === d ? "default" : "outline"} onClick={() => setTradeDuration(d)} disabled={isTrading}>
                                                {d}s
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <Label>Trade With</Label>
                                    {balances.length === 0 ? <p className="text-sm text-muted-foreground">No balances found</p> :
                                    <Select value={selectedBalanceCurrency} onValueChange={setSelectedBalanceCurrency} disabled={isTrading}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {balances.map(b => <SelectItem key={b.currency} value={b.currency}>{b.currency} ({parseFloat(b.amount).toFixed(4)})</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    }
                                </div>
                                <div>
                                  <Label htmlFor="amount">{`Amount (${selectedBalanceCurrency})`}</Label>
                                  <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={isTrading || !isKycVerified} placeholder={tradeSettings[tradeDuration] ? `Min: ${tradeSettings[tradeDuration].min_capital}` : 'Enter amount'} />
                                </div>
                                <div className="text-center text-sm text-muted-foreground">
                                    {tradeSettings[tradeDuration] ? `Win: +${(tradeSettings[tradeDuration].win_rate * 100).toFixed(0)}%` : 'Select a duration'}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button className="bg-green-500 hover:bg-green-600 text-white h-12 flex items-center justify-center gap-2" onClick={() => startTrade('buy')} disabled={isTrading || !isKycVerified || !tradeSettings[tradeDuration]}><TrendingUp className="h-5 w-5"/> Buy</Button>
                                    <Button className="bg-red-500 hover:bg-red-600 text-white h-12 flex items-center justify-center gap-2" onClick={() => startTrade('sell')} disabled={isTrading || !isKycVerified || !tradeSettings[tradeDuration]}><TrendingDown className="h-5 w-5"/> Sell</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-8">
                    <TransactionsHistory key={refreshHistory} />
                </div>
            </div>

            <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{tradeResult?.win ? 'Congratulations! You Won!' : 'Trade Ended.'}</DialogTitle>
                        <DialogDescription>
                            {tradeResult?.win
                                ? `You made a profit of ${tradeResult?.profit.toFixed(6)} ${tradeResult?.currency}.`
                                : `You lost ${Math.abs(tradeResult?.profit).toFixed(6)} ${tradeResult?.currency}.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter><Button onClick={() => setIsResultModalOpen(false)}>Close</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Trading;