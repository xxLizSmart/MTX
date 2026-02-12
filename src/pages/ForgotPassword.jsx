import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { sendPasswordResetEmail } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);

    const { error } = await sendPasswordResetEmail(email);
    
    if (!error) {
      toast({
        title: 'Check your email',
        description: 'A password reset link has been sent to your email address.',
      });
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - MetaTradeX</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background to-secondary/10">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
            <CardDescription>Enter your email to receive a reset link.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center space-y-4">
                <p>If an account with that email exists, you will receive a password reset link shortly. Please check your inbox (and spam folder).</p>
                <Button asChild className="w-full">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} placeholder="you@example.com" />
                </div>
                <Button type="submit" className="w-full !mt-6" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            )}
            <p className="mt-4 text-center text-sm">
              Remembered your password? <Link to="/login" className="font-semibold text-primary hover:underline">{t('signIn')}</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ForgotPassword;