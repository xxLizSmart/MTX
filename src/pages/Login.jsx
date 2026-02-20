import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, ArrowRight, Mail, Phone } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

const Login = () => {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const { signIn, signInWithPhone } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

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

  return (
    <>
      <Helmet>
        <title>{t('login')} - MetaTradeX</title>
      </Helmet>
      <AuthLayout>
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-slate-400 mb-8">Enter your credentials to continue</p>

        <div className="flex mb-6 bg-[#1F2937] rounded-lg p-1 border border-slate-700">
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setIdentity(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              loginMethod === 'email'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail size={16} /> Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('phone'); setIdentity(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              loginMethod === 'phone'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone size={16} /> Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              required
              disabled={loading}
              className="w-full bg-[#1F2937] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={loginMethod === 'email' ? 'name@company.com' : '+1234567890'}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#1F2937] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors"
              >
                {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 mt-2"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </form>
      </AuthLayout>
    </>
  );
};

export default Login;
