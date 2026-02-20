import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

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
      <AuthLayout>
        {submitted ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-slate-400 text-sm">
                If an account with that email exists, you will receive a password reset link shortly. Please check your inbox and spam folder.
              </p>
            </div>
            <Link
              to="/login"
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              <ArrowLeft size={18} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-1">Forgot password?</h1>
            <p className="text-slate-400 mb-8">Enter your email and we'll send you a reset link</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-[#1F2937] border border-slate-700 rounded-lg px-4 py-3 text-[16px] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="name@company.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send Reset Link <ArrowRight size={18} /></>
                )}
              </button>

              <div className="text-center mt-6">
                <p className="text-slate-500 text-sm">
                  Remembered your password?{' '}
                  <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
