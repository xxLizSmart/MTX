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
  const [currency, setCurrency] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const wallets = {
    'USDT': {
      address: 'TPebRFeKyyihDTfB7G9qKN2wS9pEamScfp',
      network: 'TRC20',
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    'ETH': {
      address: '0xb38d6b91749f53aca752fb0c2bda03d643739830',
      network: 'ERC-20',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    'BTC': {
      address: '14gyyiVkfVAZRtx42miquQfr9j4GyTUJHH',
      network: 'Bitcoin',
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
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

      // Create deposit record
      const { error: dbError } = await supabase.from('deposits').insert({
        user_id: user.id,
        amount: parseFloat(amount),
        currency: currency,
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
      <div className="container mx-auto p-4 max-w-2xl">
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
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">Tether (USDT) - TRC20</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
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
                <img src={wallets[currency].icon} alt={currency} className="w-12 h-12" />
                <div>
                  <p className="font-bold">{currency}</p>
                  <p className="text-sm text-muted-foreground">Network: {wallets[currency].network}</p>
                </div>
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
                  Send only {currency} ({wallets[currency].network}) to this address.
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