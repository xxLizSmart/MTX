import React from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, DollarSign, Users, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const stats = [
        { title: 'Total Balance', value: '$10,250.75', change: '+2.5%', icon: <DollarSign className="h-6 w-6 text-muted-foreground" /> },
        { title: "Today's P&L", value: '$150.20', change: '+1.8%', icon: <Activity className="h-6 w-6 text-muted-foreground" /> },
        { title: 'Total Referrals', value: '12', change: '+2 this week', icon: <Users className="h-6 w-6 text-muted-foreground" /> }
    ];

    return (
        <>
            <Helmet>
                <title>{t('dashboard')} - MetaTradeX</title>
            </Helmet>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl font-bold mb-6">{t('dashboard')}</h1>
                </motion.div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.change}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>A log of your recent account activity.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">No recent transactions. Start trading or deposit funds!</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Get started with these common actions.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Button onClick={() => navigate('/assets')}>
                                <Activity className="mr-2 h-4 w-4" /> Start Trading
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/deposit')}>
                                <DollarSign className="mr-2 h-4 w-4" /> Deposit Funds
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/referral')}>
                                <Users className="mr-2 h-4 w-4" /> Invite Friends
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Dashboard;