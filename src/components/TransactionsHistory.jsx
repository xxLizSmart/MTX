import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

const TRANSACTIONS_PER_PAGE = 10;

const TransactionsHistory = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchTransactions = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch deposits
            const { data: deposits, error: depositsError } = await supabase
                .from('deposits')
                .select('*')
                .eq('user_id', user.id);
            
            if (depositsError) throw depositsError;

            // Fetch withdrawals
            const { data: withdrawals, error: withdrawalsError } = await supabase
                .from('withdrawals')
                .select('*')
                .eq('user_id', user.id);

            if (withdrawalsError) throw withdrawalsError;

            // Fetch trades/swaps (transactions table)
            const { data: trades, error: tradesError } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id);

            if (tradesError) throw tradesError;

            const formattedDeposits = (deposits || []).map(d => ({ ...d, type: 'deposit' }));
            const formattedWithdrawals = (withdrawals || []).map(w => ({ ...w, type: 'withdraw' }));
            const formattedTrades = (trades || []).filter(t => ['trade', 'swap'].includes(t.type));

            const allTransactions = [...formattedDeposits, ...formattedWithdrawals, ...formattedTrades]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setTransactions(allTransactions);
            setHasMore(allTransactions.length > (page + 1) * TRANSACTIONS_PER_PAGE);
        } catch (error) {
            console.error("Transaction fetch error:", error);
            toast({ variant: 'destructive', title: 'Failed to fetch transaction history', description: error.message });
        } finally {
            setLoading(false);
        }
    }, [user, toast, page]);

    useEffect(() => {
        fetchTransactions();
        // Optional: Realtime subscription could be added here
    }, [fetchTransactions]);

    const paginatedTransactions = useMemo(() => {
        const start = page * TRANSACTIONS_PER_PAGE;
        const end = start + TRANSACTIONS_PER_PAGE;
        return transactions.slice(start, end);
    }, [transactions, page]);

    const renderStatusBadge = (status) => {
        const variants = {
            completed: 'default',
            pending: 'secondary',
            approved: 'success',
            rejected: 'destructive',
            win: 'success',
            loss: 'destructive',
        };
        const lowerCaseStatus = status?.toLowerCase();
        return <Badge variant={variants[lowerCaseStatus] || 'default'} className="capitalize">{lowerCaseStatus}</Badge>;
    };
    
    const getTransactionDetails = (tx) => {
        switch (tx.type) {
            case 'deposit':
                return `Deposit of ${tx.amount} ${tx.currency}`;
            case 'withdraw':
                return `Withdrawal of ${tx.amount} ${tx.currency}`;
            case 'swap':
                return `Swapped ${tx.from_amount} ${tx.from_currency} for ${parseFloat(tx.to_amount).toFixed(4)} ${tx.to_currency}`;
            case 'trade':
                const outcome = tx.status === 'win' ? 'Profit' : 'Loss';
                return `Trade: ${outcome} of ${Math.abs(tx.to_amount).toFixed(4)} ${tx.to_currency}`;
            default:
                return 'Transaction';
        }
    };

    return (
        <Card className="w-full glassmorphic mt-4">
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>A log of your recent account activity.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No transactions yet.</p>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedTransactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                                        <TableCell className="capitalize">{tx.type}</TableCell>
                                        <TableCell>{getTransactionDetails(tx)}</TableCell>
                                        <TableCell className="text-right">{renderStatusBadge(tx.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p - 1)}
                                disabled={page === 0}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => p + 1)}
                                disabled={!hasMore}
                            >
                                Next
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default TransactionsHistory;