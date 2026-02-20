import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, ArrowRight, Mail, Phone } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [signupMethod, setSignupMethod] = useState('email');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: 'Passwords do not match.',
      });
      return;
    }
    setLoading(true);

    const credentials = { password };
    if (signupMethod === 'email') {
      if (!email) {
        toast({ variant: 'destructive', title: t('error'), description: 'Email is required.' });
        setLoading(false);
        return;
      }
      credentials.email = email;
    } else {
      if (!phone) {
        toast({ variant: 'destructive', title: t('error'), description: 'Phone number is required.' });
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
      },
    });

    if (!error) {
      toast({
        title: t('success'),
        description: 'Success! Please check your email or phone to verify your account.',
      });
      navigate('/login');
    }
    setLoading(false);
  };

  const inputClasses = 'w-full bg-[#1F2937] border border-slate-700 rounded-lg px-4 py-3 text-[16px] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  return (
    <>
      <Helmet>
        <title>{t('register')} - MetaTradeX</title>
      </Helmet>
      <AuthLayout>
        <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
        <p className="text-slate-400 mb-6">Start trading on the world's most advanced platform</p>

        <div className="flex mb-6 bg-[#1F2937] rounded-lg p-1 border border-slate-700">
          <button
            type="button"
            onClick={() => setSignupMethod('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              signupMethod === 'email'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail size={16} /> Email
          </button>
          <button
            type="button"
            onClick={() => setSignupMethod('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              signupMethod === 'phone'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone size={16} /> Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={loading}
                className={inputClasses}
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={loading}
                className={inputClasses}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {signupMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={signupMethod === 'email' ? 'email' : 'tel'}
              value={signupMethod === 'email' ? email : phone}
              onChange={(e) => signupMethod === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
              disabled={loading}
              className={inputClasses}
              placeholder={signupMethod === 'email' ? 'name@company.com' : '+1234567890'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className={inputClasses}
                placeholder="Create a strong password"
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={isConfirmVisible ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className={inputClasses}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors"
              >
                {isConfirmVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Referral Code (Optional)</label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              disabled={loading}
              className={inputClasses}
              placeholder="Enter referral code"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 mt-2 min-h-[44px]"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create Account <ArrowRight size={18} /></>
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </AuthLayout>
    </>
  );
};

export default Register;
