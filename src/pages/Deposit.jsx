import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

const Deposit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currency, setCurrency] = useState('USDT_TRC20');
  const [amount, setAmount] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const wallets = {
    'USDT_TRC20': {
      label: 'TRC20 Primary',
      address: 'TGiVATRc2m9gR8CrsWicdjT85eQduKdCv7',
      network: 'TRC20',
      currency: 'USDT',
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      qr: 'https://horizons-cdn.hostinger.com/99b11fa1-2bd3-41b7-81bc-612ff4483c7a/7f0438f952703496b6f01200f958279c.jpg'
    },
    'USDT_ERC20': {
      label: 'ERC20 Primary (USDT)',
      address: '0xaedebf28b3661d8266120f31008b8c6757079c1f',
      network: 'ERC20',
      currency: 'USDT',
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      qr: 'https://horizons-cdn.hostinger.com/99b11fa1-2bd3-41b7-81bc-612ff4483c7a/d05c22c6c88a5782652e213b7bb8d315.jpg'
    },
    'BTC': {
      label: 'BTC Primary',
      address: '1Mp5fM4Uti1Tw2yJXZq5FRNXWKpXLjuzY2',
      network: 'Bitcoin',
      currency: 'BTC',
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      qr: 'https://horizons-cdn.hostinger.com/99b11fa1-2bd3-41b7-81bc-612ff4483c7a/c23861a72c52e6439c69d99326bd4830.jpg'
    },
    'ETH': {
      label: 'ETH Primary',
      address: '0xaedebf28b3661d8266120f31008b8c6757079c1f',
      network: 'ERC20',
      currency: 'ETH',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      qr: 'https://horizons-cdn.hostinger.com/99b11fa1-2bd3-41b7-81bc-612ff4483c7a/d05c22c6c88a5782'
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(wallets[currency].address);
    toast({ title: "Copied!", description: "Wallet address copied to clipboard." });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !proofFile) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please enter amount and upload proof." });
      return;
    }

    setLoading(true);
    try {
      // Upload proof
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('deposits')
        .upload(fileName, proofFile);

      if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage.from('deposits').getPublicUrl(fileName);

      const depositCurrency = wallets[currency].currency;

      await supabase.from('user_assets').upsert(
        { user_id: user.id, symbol: depositCurrency, amount: 0 },
        { onConflict: 'user_id,symbol', ignoreDuplicates: true }
      );

      const { error: dbError } = await supabase.from('deposits').insert({
        user_id: user.id,
        amount: parseFloat(amount),
        currency: depositCurrency,
        proof_url: publicUrl,
        status: 'pending'
      });

      if (dbError) throw dbError;

      toast({ title: "Deposit Submitted", description: "Your deposit is pending approval." });
      setAmount('');
      setProofFile(null);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Deposit - MetaTradeX</title></Helmet>
      <div className="container mx-auto px-6 py-4 sm:p-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-6">Deposit Funds</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Currency</CardTitle>
              <CardDescription>Choose the cryptocurrency you wish to deposit.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Network" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(wallets).map(([key, w]) => (
                    <SelectItem key={key} value={key}>{w.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <img src={wallets[currency].icon} alt={wallets[currency].currency} className="w-12 h-12" />
                <div>
                  <p className="font-bold">{wallets[currency].label}</p>
                  <p className="text-sm text-muted-foreground">Network: {wallets[currency].network}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <img
                  src={wallets[currency].qr}
                  alt="QR Code"
                  className="w-48 h-48 rounded-lg border border-border object-contain bg-white p-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <div className="flex gap-2">
                  <Input readOnly value={wallets[currency].address} className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-yellow-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Send only {wallets[currency].currency} ({wallets[currency].network}) to this address.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Confirm Deposit</CardTitle>
              <CardDescription>Enter the amount sent and upload proof of payment.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount Sent</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proof">Proof of Payment (Screenshot)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      id="proof" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2">
                      {proofFile ? (
                        <>
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                          <span className="text-sm font-medium">{proofFile.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Click to upload screenshot</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Deposit"}
                </Button>
              </form>
            </CardContent>
          </Card>

        </motion.div>
      </div>
    </>
  );
};

export default Deposit;