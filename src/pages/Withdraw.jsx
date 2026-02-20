import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Withdraw = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const { user, userProfile } = useAuth();
    const [currency, setCurrency] = useState('USDT');
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userProfile?.kyc_status !== 'approved') {
            toast({ variant: 'destructive', title: 'KYC Required', description: 'Please complete and wait for KYC approval to withdraw funds.' });
            return;
        }

        if (!currency || !address || !amount) {
             toast({ variant: "destructive", title: "Missing Information", description: "Please fill all fields." });
            return;
        }
        if (!agreed) {
            toast({ variant: "destructive", title: "Agreement Required", description: "You must agree to the terms and services." });
            return;
        }

        setLoading(true);

        try {
            // 1. Fetch current balance
            const { data: balanceData, error: balanceError } = await supabase
                .from('user_assets')
                .select('*')
                .eq('user_id', user.id)
                .eq('symbol', currency)
                .single();

            if (balanceError || !balanceData) {
                throw new Error('Could not fetch your balance. You may not have funds in this currency.');
            }

            const currentAmount = parseFloat(balanceData.amount);
            const withdrawAmount = parseFloat(amount);

            if (withdrawAmount > currentAmount) {
                throw new Error(`Insufficient funds. Your balance is ${currentAmount} ${currency}.`);
            }

            // 2. Deduct balance first (Optimistic update / Lock funds)
            const { error: updateError } = await supabase
                .from('user_assets')
                .update({ amount: currentAmount - withdrawAmount })
                .eq('id', balanceData.id);

            if (updateError) throw updateError;

            // 3. Create Withdrawal Record
            const { error: insertError } = await supabase.from('withdrawals').insert({
                user_id: user.id,
                amount: withdrawAmount,
                currency,
                wallet_address: address,
                status: 'pending'
            });

            if (insertError) {
                // Rollback balance deduction if insert failed
                await supabase
                    .from('user_assets')
                    .update({ amount: currentAmount })
                    .eq('id', balanceData.id);
                throw insertError;
            }

            toast({
                title: "Withdrawal Request Submitted",
                description: "Your funds have been deducted and are pending review.",
            });
            setCurrency('USDT');
            setAddress('');
            setAmount('');
            setAgreed(false);

        } catch (error) {
            toast({ variant: "destructive", title: "Withdrawal Failed", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>{t('withdraw')} - MetaTradeX</title>
            </Helmet>
            <div className="container mx-auto px-6 py-4 sm:p-6 lg:p-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
                 <Card className="w-full max-w-lg glassmorphic">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">{t('withdraw')}</CardTitle>
                        <CardDescription>Enter your wallet details to withdraw funds.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label>Currency</Label>
                                <Select onValueChange={setCurrency} value={currency}>
                                    <SelectTrigger><SelectValue placeholder="Select a currency" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USDT">USDT</SelectItem>
                                        <SelectItem value="BTC">BTC</SelectItem>
                                        <SelectItem value="ETH">ETH</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="address">Wallet Address</Label>
                                <Input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your wallet address"/>
                            </div>
                            <div>
                                <Label htmlFor="amount">Amount ({currency})</Label>
                                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Enter amount in ${currency}`}/>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="terms" checked={agreed} onCheckedChange={setAgreed} />
                                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I agree to the <Link to="/terms" className="underline text-primary">terms and services</Link>.
                                </label>
                            </div>
                            <div className="mt-4 p-3 rounded-lg bg-yellow-400/10 text-yellow-500 border border-yellow-400/20">
                                <h4 className="font-semibold flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Important Notice</h4>
                                <ul className="list-disc list-inside text-xs mt-2 space-y-1">
                                    <li>Withdrawals are processed within 24 hours.</li>
                                    <li>Ensure the wallet address is correct and corresponds to the selected currency.</li>
                                    <li>Transactions are irreversible. We are not responsible for funds sent to the wrong address.</li>
                                </ul>
                            </div>
                            <Button type="submit" className="w-full !mt-8" size="lg" disabled={loading}>
                                {loading ? 'Processing...' : t('submit')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Withdraw;