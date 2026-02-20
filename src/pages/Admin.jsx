import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, RefreshCw, Eye, Edit, User, DollarSign, Shield, FileText, Settings, Key } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Admin = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState({ users: [], deposits: [], withdrawals: [], kyc: [], tradeSettings: [] });
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [userBalances, setUserBalances] = useState([]);
  const [editSetting, setEditSetting] = useState(null);
  const [newBalanceSymbol, setNewBalanceSymbol] = useState('');

  const fetchData = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase.from('profiles').select('*');
      if (usersError) throw new Error(`Users Fetch: ${usersError.message}`);
      
      const allUsers = usersData || [];
      const usersMap = new Map(allUsers.map(user => [user.id, user]));

      const { data: deposits, error: depositsError } = await supabase.from('deposits').select('*');
      if (depositsError) throw new Error(`Deposits Fetch: ${depositsError.message}`);

      const { data: withdrawals, error: withdrawalsError } = await supabase.from('withdrawals').select('*');
      if (withdrawalsError) throw new Error(`Withdrawals Fetch: ${withdrawalsError.message}`);

      const { data: kyc, error: kycError } = await supabase.from('profiles').select('*').in('kyc_status', ['pending', 'approved', 'rejected']);
      if (kycError) throw new Error(`KYC Fetch: ${kycError.message}`);
      
      const { data: tradeSettings, error: settingsError } = await supabase.from('trade_settings').select('*').order('duration');
      if (settingsError && settingsError.code !== '42P01') throw new Error(`Settings Fetch: ${settingsError.message}`);
      
      // Helper to attach user info to related data
      const attachUser = (items) => items.map(item => ({ ...item, users: usersMap.get(item.user_id) }));

      setData({ 
        users: allUsers, 
        deposits: attachUser(deposits || []), 
        withdrawals: attachUser(withdrawals || []), 
        kyc: kyc || [],
        tradeSettings: tradeSettings || []
      });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Failed to fetch data", description: error.message });
    }
    setLoading(false);
  }, [toast, session]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [fetchData, session]);

  const callEdgeFunction = async (table, id, action) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const response = await fetch(`${supabaseUrl}/functions/v1/admin-approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentSession.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ action, table, id }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Edge function failed');
    }
    return result;
  };

  const callRpcFunction = async (table, id, action) => {
    const rpcName = `${action}_${table === 'deposits' ? 'deposit' : 'withdrawal'}`;
    const paramName = table === 'deposits' ? 'p_deposit_id' : 'p_withdrawal_id';
    const { data, error } = await supabase.rpc(rpcName, {
      [paramName]: id,
      p_admin_id: session.user.id,
    });
    if (error) throw error;
    if (data && !data.success) throw new Error(data.error);
    return data;
  };

  const directApproval = async (table, id, status, extraData) => {
    const updateData = { status, reviewed_by: session.user.id, reviewed_at: new Date().toISOString() };
    const { error } = await supabase.from(table).update(updateData).eq('id', id);
    if (error) throw error;

    const shouldAddBalance =
      (table === 'deposits' && status === 'approved') ||
      (table === 'withdrawals' && status === 'rejected');

    if (shouldAddBalance && extraData.userId) {
      const { data: currentAsset } = await supabase
        .from('user_assets')
        .select('id, amount')
        .eq('user_id', extraData.userId)
        .eq('symbol', extraData.currency)
        .maybeSingle();

      if (currentAsset) {
        const { error: balError } = await supabase
          .from('user_assets')
          .update({ amount: parseFloat(currentAsset.amount) + parseFloat(extraData.amount) })
          .eq('id', currentAsset.id);
        if (balError) throw balError;
      } else {
        const { error: insError } = await supabase
          .from('user_assets')
          .insert({ user_id: extraData.userId, symbol: extraData.currency, amount: parseFloat(extraData.amount) });
        if (insError) throw insError;
      }
    }
  };

  const handleUpdateStatus = async (table, id, status, extraData = {}) => {
    if (!session) return;
    setLoading(true);
    try {
      if (table === 'profiles') {
        const { error } = await supabase.from(table).update({ kyc_status: status }).eq('id', id);
        if (error) throw error;
        toast({ title: "Success", description: `Status updated to ${status}` });
        await fetchData();
        setLoading(false);
        return;
      }

      const action = status === 'approved' ? 'approve' : 'reject';

      try {
        await callEdgeFunction(table, id, action);
      } catch (edgeErr) {
        try {
          await callRpcFunction(table, id, action);
        } catch (rpcErr) {
          await directApproval(table, id, status, extraData);
        }
      }

      toast({ title: "Success", description: `Status updated to ${status}` });
      await fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    }
    setLoading(false);
  };

  const handleOpenUserEdit = async (user) => {
    setEditUser(user);
    setLoading(true);
    const { data, error } = await supabase.from('user_assets').select('*').eq('user_id', user.id);
    if (error) {
      toast({ variant: "destructive", title: "Failed to fetch balances", description: error.message });
      setUserBalances([]);
    } else {
      setUserBalances(data);
    }
    setLoading(false);
  };

  const handleUpdateUserBalance = async (balanceId, newAmount) => {
    const { error } = await supabase.from('user_assets').update({ amount: newAmount }).eq('id', balanceId);
    if (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    } else {
      toast({ title: "Success", description: "Balance updated" });
      handleOpenUserEdit(editUser);
    }
  };

  const handleAddBalance = async () => {
    if (!editUser || !newBalanceSymbol.trim()) return;
    const symbol = newBalanceSymbol.trim().toUpperCase();
    const { error } = await supabase.from('user_assets').insert({ user_id: editUser.id, symbol, amount: 0 });
    if (error) {
      toast({ variant: "destructive", title: "Add failed", description: error.message });
    } else {
      toast({ title: "Success", description: `${symbol} balance added` });
      setNewBalanceSymbol('');
      handleOpenUserEdit(editUser);
    }
  };

  const handleUpdateTradeSetting = async () => {
    if (!editSetting) return;
    setLoading(true);
    const { id, ...updateData } = editSetting;
    const { error } = await supabase.from('trade_settings').update(updateData).eq('id', id);
    if (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    } else {
      toast({ title: "Success", description: "Trade setting updated" });
      setEditSetting(null);
      await fetchData();
    }
    setLoading(false);
  };
  
  const handleTradeOverrideSwitch = async (userId, outcome) => {
    setLoading(true);
    const { data: updatedUser, error } = await supabase
      .from('profiles')
      .update({ trade_override_status: outcome })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Override failed", description: error.message });
    } else {
      toast({ title: "Success", description: `Trade override for user set to: ${outcome || 'OFF'}` });
      setEditUser(updatedUser);
      setData(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === userId ? updatedUser : u)
      }));
    }
    setLoading(false);
  };

  const handleToggleAdmin = async (userId, currentStatus) => {
      setLoading(true);
      const { data: updatedUser, error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId)
        .select()
        .single();
    
      if (error) {
          toast({ variant: "destructive", title: "Update failed", description: error.message });
      } else {
          toast({ title: "Success", description: `User admin status updated` });
          setEditUser(updatedUser);
          setData(prev => ({
              ...prev,
              users: prev.users.map(u => u.id === userId ? updatedUser : u)
          }));
      }
      setLoading(false);
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': case 'win': case 'completed': return <Badge variant="success" className="bg-green-500">{status}</Badge>;
      case 'pending': return <Badge variant="secondary">{status}</Badge>;
      case 'rejected': case 'loss': return <Badge variant="destructive">{status}</Badge>;
      default: return <Badge>{status || 'N/A'}</Badge>;
    }
  };

  const renderUsers = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>KYC</TableHead>
          <TableHead>Trade Override</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.users.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.first_name || 'N/A'} {user.last_name || ''}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.is_admin ? <Badge className="bg-purple-600">Admin</Badge> : <Badge variant="outline">User</Badge>}</TableCell>
            <TableCell>{getStatusBadge(user.kyc_status)}</TableCell>
            <TableCell>{user.trade_override_status ? getStatusBadge(user.trade_override_status) : <Badge variant="outline">Off</Badge>}</TableCell>
            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => handleOpenUserEdit(user)}><Edit className="h-4 w-4" /></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  
  const renderRequests = (items, type) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          {type === 'deposits' && <TableHead>Proof</TableHead>}
          {type === 'withdrawals' && <TableHead>Address</TableHead>}
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.users?.first_name || 'N/A'} {item.users?.last_name || ''}</TableCell>
            <TableCell>{item.users?.email}</TableCell>
            <TableCell>{item.amount} {item.currency}</TableCell>
            <TableCell>{getStatusBadge(item.status)}</TableCell>
            {type === 'deposits' && (
              <TableCell>
                {item.proof_url && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setSelectedImage(item.proof_url)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                )}
              </TableCell>
            )}
            {type === 'withdrawals' && <TableCell className="truncate max-w-[150px]">{item.wallet_address}</TableCell>}
            <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
            <TableCell className="space-x-2">
              {item.status === 'pending' && (
                <>
                  <Button size="icon" variant="ghost" className="text-green-500" onClick={() => handleUpdateStatus(type, item.id, 'approved', { userId: item.user_id, amount: item.amount, currency: item.currency })}>
                    <Check className="h-4 w-4"/>
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleUpdateStatus(type, item.id, 'rejected', { userId: item.user_id, amount: item.amount, currency: item.currency })}>
                    <X className="h-4 w-4"/>
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderKYC = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Document</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.kyc.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.first_name} {user.last_name}</TableCell>
            <TableCell>{user.email || 'N/A'}</TableCell>
            <TableCell>{user.country || 'N/A'}</TableCell>
            <TableCell>{getStatusBadge(user.kyc_status)}</TableCell>
            <TableCell>
              {user.id_document_url && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setSelectedImage(user.id_document_url)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
            </TableCell>
            <TableCell className="space-x-2">
              {user.kyc_status === 'pending' && (
                <>
                  <Button size="icon" variant="ghost" className="text-green-500" onClick={() => handleUpdateStatus('profiles', user.id, 'approved', { kyc: true })}>
                    <Check className="h-4 w-4"/>
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleUpdateStatus('profiles', user.id, 'rejected', { kyc: true })}>
                    <X className="h-4 w-4"/>
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderTradeSettings = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Duration (s)</TableHead>
          <TableHead>Win Rate (%)</TableHead>
          <TableHead>Loss Rate (%)</TableHead>
          <TableHead>Min Capital</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.tradeSettings.map(setting => (
          <TableRow key={setting.id}>
            <TableCell>{setting.duration}</TableCell>
            <TableCell>{(setting.win_rate * 100).toFixed(2)}</TableCell>
            <TableCell>{(setting.loss_rate * 100).toFixed(2)}</TableCell>
            <TableCell>{setting.min_capital}</TableCell>
            <TableCell>
              <Button size="icon" variant="ghost" onClick={() => setEditSetting(setting)}><Edit className="h-4 w-4"/></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <>
      <Helmet><title>Admin Panel - MetaTradeX</title></Helmet>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={fetchData} disabled={loading} variant="outline" size="icon"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-4">
            <TabsTrigger value="users"><User className="w-4 h-4 mr-2"/>Users</TabsTrigger>
            <TabsTrigger value="deposits"><DollarSign className="w-4 h-4 mr-2"/>Deposits</TabsTrigger>
            <TabsTrigger value="withdrawals"><DollarSign className="w-4 h-4 mr-2"/>Withdrawals</TabsTrigger>
            <TabsTrigger value="kyc"><FileText className="w-4 h-4 mr-2"/>KYC</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2"/>Trading</TabsTrigger>
          </TabsList>
          <motion.div key={activeTab} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="overflow-x-auto">
            <TabsContent value="users">{loading ? <p>Loading...</p> : renderUsers()}</TabsContent>
            <TabsContent value="deposits">{loading ? <p>Loading...</p> : renderRequests(data.deposits, 'deposits')}</TabsContent>
            <TabsContent value="withdrawals">{loading ? <p>Loading...</p> : renderRequests(data.withdrawals, 'withdrawals')}</TabsContent>
            <TabsContent value="kyc">{loading ? <p>Loading...</p> : renderKYC()}</TabsContent>
            <TabsContent value="settings">{loading ? <p>Loading...</p> : renderTradeSettings()}</TabsContent>
          </motion.div>
        </Tabs>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Document Viewer</DialogTitle></DialogHeader>
          {selectedImage && <img src={selectedImage} alt="KYC or Deposit Proof" className="max-w-full h-auto rounded-md" />}
          <DialogFooter>
            <Button onClick={() => window.open(selectedImage, '_blank')}>Download</Button>
            <Button onClick={() => setSelectedImage(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit User: {editUser?.first_name} {editUser?.last_name}</DialogTitle><DialogDescription>Manage user balances and trade outcomes.</DialogDescription></DialogHeader>
          <div className="py-4 space-y-4">
            
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
               <div className="flex items-center gap-2">
                   <Key className="h-4 w-4 text-purple-600"/>
                   <div className="space-y-0.5">
                       <Label className="text-base">Admin Status</Label>
                       <p className="text-xs text-muted-foreground">Grant full administrative access to this user.</p>
                   </div>
               </div>
               <Switch checked={editUser?.is_admin} onCheckedChange={() => handleToggleAdmin(editUser.id, editUser.is_admin)} disabled={loading} />
            </div>

            <h3 className="font-semibold">Balances</h3>
            {loading ? <p>Loading balances...</p> : userBalances.map(balance => (
              <div key={balance.id} className="flex items-center gap-2">
                <Label className="w-20">{balance.symbol}</Label>
                <Input type="number" defaultValue={balance.amount} onBlur={(e) => handleUpdateUserBalance(balance.id, e.target.value)} />
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <Input placeholder="Symbol (e.g. BTC)" value={newBalanceSymbol} onChange={(e) => setNewBalanceSymbol(e.target.value)} className="w-40" />
              <Button variant="outline" size="sm" onClick={handleAddBalance} disabled={!newBalanceSymbol.trim()}>Add Balance</Button>
            </div>
            <h3 className="font-semibold pt-4">Trade Control</h3>
             <div className="p-3 rounded-md border bg-background/50 space-y-2">
               <div className="flex justify-between items-center">
                 <Label>Current Status:</Label>
                 {editUser?.trade_override_status ? getStatusBadge(editUser.trade_override_status) : <Badge variant="outline">OFF</Badge>}
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                 <Button variant="success" className="bg-green-500" onClick={() => handleTradeOverrideSwitch(editUser.id, 'win')} disabled={loading || editUser?.trade_override_status === 'win'}>Switch Win ON</Button>
                 <Button variant="destructive" onClick={() => handleTradeOverrideSwitch(editUser.id, 'loss')} disabled={loading || editUser?.trade_override_status === 'loss'}>Switch Loss ON</Button>
                 <Button variant="outline" onClick={() => handleTradeOverrideSwitch(editUser.id, null)} disabled={loading || !editUser?.trade_override_status}>Switch OFF</Button>
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={() => setEditUser(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editSetting} onOpenChange={() => setEditSetting(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Setting for {editSetting?.duration}s</DialogTitle></DialogHeader>
          {editSetting && (<div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="win_rate" className="text-right">Win Rate (%)</Label><Input id="win_rate" type="number" value={editSetting.win_rate * 100} onChange={(e) => setEditSetting({...editSetting, win_rate: parseFloat(e.target.value) / 100})} className="col-span-3"/></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="loss_rate" className="text-right">Loss Rate (%)</Label><Input id="loss_rate" type="number" value={editSetting.loss_rate * 100} onChange={(e) => setEditSetting({...editSetting, loss_rate: parseFloat(e.target.value) / 100})} className="col-span-3"/></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="min_capital" className="text-right">Min Capital</Label><Input id="min_capital" type="number" value={editSetting.min_capital} onChange={(e) => setEditSetting({...editSetting, min_capital: parseFloat(e.target.value)})} className="col-span-3"/></div>
          </div>)}
          <DialogFooter><Button onClick={handleUpdateTradeSetting} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Admin;