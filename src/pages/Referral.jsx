import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Gift, Users, Loader2, Share2, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';

const Referral = () => {
    const { t } = useLanguage();
    const { user, userProfile } = useAuth();
    const { toast } = useToast();
    const [referralCode, setReferralCode] = useState('');
    const [referrals, setReferrals] = useState([]);
    const [totalRewards, setTotalRewards] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userProfile) {
            setReferralCode(userProfile.referral_code);
        }
    }, [userProfile]);

    useEffect(() => {
        const fetchReferralData = async () => {
            if (user) {
                setLoading(true);

                const { data: referralData, error: referralsError } = await supabase
                    .from('referrals')
                    .select('created_at, referred_id, reward_amount, status')
                    .eq('referrer_id', user.id);

                const referralsWithNames = await Promise.all((referralData || []).map(async (ref) => {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('id, first_name, last_name')
                        .eq('id', ref.referred_id)
                        .maybeSingle();
                    return { ...ref, referee: profile };
                }));

                if (referralsError) {
                    console.error('Error fetching referrals:', referralsError);
                    toast({
                        variant: 'destructive',
                        title: 'Error Fetching Referrals',
                        description: referralsError.message,
                    });
                } else {
                    setReferrals(referralsWithNames);
                    const rewards = (referralData || []).reduce((sum, r) => sum + (parseFloat(r.reward_amount) || 0), 0);
                    setTotalRewards(rewards);
                }
                
                setLoading(false);
            }
        };
        if(user) fetchReferralData();
    }, [user, toast]);
    
    const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

    const copyToClipboard = (text) => {
        if (!text) {
            toast({ variant: 'destructive', title: 'Error', description: 'Content not available.' });
            return;
        }
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied!', description: 'Referral link copied to clipboard.' });
    };

    return (
        <>
            <Helmet><title>Referral Program - MetaTradeX</title></Helmet>
            <div className="container mx-auto px-6 py-4 sm:p-6 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <Share2 className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-primary mb-4" />
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight gradient-text">Invite & Earn</h1>
                    <p className="mt-4 text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Share your love for MetaTradeX and earn rewards. Your friends get a sign-up bonus, and you get commission on their trades.
                    </p>
                </motion.div>
                
                <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
                    <Card className="glassmorphic glowing-border">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2"><Gift className="h-6 w-6 text-primary"/> Your Referral Link</CardTitle>
                            <CardDescription>Share this unique link with your friends.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Input value={referralCode ? referralLink : 'Generating...'} readOnly className="text-md font-mono bg-background/50 flex-grow" />
                            <Button onClick={() => copyToClipboard(referralLink)} size="icon" variant="outline" disabled={!referralCode}>
                                <Copy className="h-5 w-5" />
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="glassmorphic">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{loading ? <Loader2 className="animate-spin h-6 w-6" /> : referrals.length}</div>
                                <p className="text-xs text-muted-foreground">friends have joined.</p>
                            </CardContent>
                        </Card>
                        <Card className="glassmorphic">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
                                <Award className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{loading ? <Loader2 className="animate-spin h-6 w-6" /> : `$${totalRewards.toFixed(2)}`}</div>
                                <p className="text-xs text-muted-foreground">earned from referrals.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Your Referred Users</CardTitle>
                        <CardDescription>Track the friends who have successfully signed up using your link.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Date Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan="2" className="text-center h-24"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
                                ) : referrals.length > 0 ? (
                                    referrals.map((ref, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{ref.referee?.first_name || 'Anonymous'} {ref.referee?.last_name || ''}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">{new Date(ref.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan="2" className="text-center h-24 text-muted-foreground">No one has used your referral link yet.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Referral;