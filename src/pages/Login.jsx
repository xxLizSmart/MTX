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

const Login = () => {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithPhone } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loginMethod, setLoginMethod] = useState("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let error;
    if (loginMethod === 'email') {
        const result = await signIn(identity, password);
        error = result.error;
    } else {
        const result = await signInWithPhone(identity, password);
        error = result.error;
    }
    
    if (!error) {
      toast({
        title: t('success'),
        description: 'Logged in successfully!',
      });
      navigate('/');
    }
    setLoading(false);
  };

  const handleIdentityChange = (e) => {
    setIdentity(e.target.value);
  }

  return (
    <>
      <Helmet>
        <title>{t('login')} - MetaTradeX</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-secondary/10">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{t('login')}</CardTitle>
            <CardDescription>{t('welcome')} back!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
               <Tabs value={loginMethod} onValueChange={(value) => { setLoginMethod(value); setIdentity(''); }} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email"><Mail className="mr-2 h-4 w-4"/>Email</TabsTrigger>
                        <TabsTrigger value="phone"><Phone className="mr-2 h-4 w-4"/>Phone</TabsTrigger>
                    </TabsList>
                    <TabsContent value="email">
                         <div className="space-y-2 pt-2">
                           <Label htmlFor="email">{t('email')}</Label>
                           <Input id="email" type="email" value={identity} onChange={handleIdentityChange} required disabled={loading} placeholder="you@example.com" />
                         </div>
                    </TabsContent>
                    <TabsContent value="phone">
                        <div className="space-y-2 pt-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" value={identity} onChange={handleIdentityChange} required disabled={loading} placeholder="+1234567890"/>
                        </div>
                    </TabsContent>
                </Tabs>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                        Forgot Password?
                    </Link>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
              </div>
              <Button type="submit" className="w-full !mt-6" disabled={loading}>
                {loading ? t('loading') : t('signIn')}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm">
              {t('dontHaveAccount')} <Link to="/register" className="font-semibold text-primary hover:underline">{t('signUp')}</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;