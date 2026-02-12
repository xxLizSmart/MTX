import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone } from 'lucide-react';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [signupMethod, setSignupMethod] = useState("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: "Passwords do not match.",
      });
      return;
    }
    setLoading(true);

    const credentials = { password };
    if (signupMethod === 'email') {
        if (!email) {
             toast({ variant: "destructive", title: t('error'), description: "Email is required."});
             setLoading(false);
             return;
        }
        credentials.email = email;
    } else {
        if(!phone) {
            toast({ variant: "destructive", title: t('error'), description: "Phone number is required."});
            setLoading(false);
            return;
        }
        credentials.phone = phone;
    }

    const { error } = await signUp(credentials, {
      data: {
        first_name: firstName,
        last_name: lastName,
        referred_by: referralCode,
      }
    });

    if (!error) {
      toast({
        title: t('success'),
        description: "Success! Please check your email or phone to verify your account.",
      });
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>{t('register')} - MetaTradeX</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-secondary/10">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{t('register')}</CardTitle>
            <CardDescription>Create your account to start trading.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="firstName">{t('firstName')}</Label><Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={loading} /></div>
                <div className="space-y-2"><Label htmlFor="lastName">{t('lastName')}</Label><Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={loading} /></div>
               </div>
               
                <Tabs value={signupMethod} onValueChange={setSignupMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4"/>Email</TabsTrigger>
                        <TabsTrigger value="phone"><Phone className="mr-2 h-4 w-4"/>Phone</TabsTrigger>
                    </TabsList>
                    <TabsContent value="email">
                         <div className="space-y-2 pt-2"><Label htmlFor="email">{t('email')}</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} placeholder="you@example.com" /></div>
                    </TabsContent>
                    <TabsContent value="phone">
                        <div className="space-y-2 pt-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} placeholder="+1234567890"/></div>
                    </TabsContent>
                </Tabs>

              <div className="space-y-2"><Label htmlFor="password">{t('password')}</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} /></div>
              <div className="space-y-2"><Label htmlFor="confirmPassword">{t('confirmPassword')}</Label><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} /></div>
              <div className="space-y-2"><Label htmlFor="referralCode">Referral Code (Optional)</Label><Input id="referralCode" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} disabled={loading} /></div>
              <Button type="submit" className="w-full !mt-6" disabled={loading}>{loading ? t('loading') : t('signUp')}</Button>
            </form>
             <p className="mt-4 text-center text-sm">{t('alreadyHaveAccount')} <Link to="/login" className="font-semibold text-primary hover:underline">{t('signIn')}</Link></p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Register;