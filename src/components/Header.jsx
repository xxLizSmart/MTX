import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, KeyRound as UserRound, Menu, X, Briefcase, Gift, Shield, TrendingUp, ArrowDownLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import Notifications from '@/components/Notifications';
import ProfileDropdown from '@/components/ProfileDropdown';
import { cn } from '@/lib/utils';

function useScroll(threshold) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  return scrolled;
}

const loggedInLinks = [
  { label: 'Markets', href: '/assets' },
  { label: 'Trade', href: '/trading' },
  { label: 'Portfolio', href: '/portfolio' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScroll(20);
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = useCallback(async () => {
    await signOut();
    navigate('/');
  }, [signOut, navigate]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const userMenuItems = [
    { name: t('Trading'), path: '/trading', icon: <TrendingUp className="mr-2 h-4 w-4" /> },
    { name: t('Portfolio'), path: '/portfolio', icon: <Briefcase className="mr-2 h-4 w-4" /> },
    { name: t('Referral'), path: '/referral', icon: <Gift className="mr-2 h-4 w-4" /> },
    { name: t('KYC'), path: '/kyc', icon: <UserRound className="mr-2 h-4 w-4" /> },
  ];

  if (userProfile?.is_admin) {
    userMenuItems.push({
      name: 'Admin',
      path: '/admin',
      icon: <Shield className="mr-2 h-4 w-4" />,
    });
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300 ease-in-out border-b border-transparent',
        {
          'bg-[#0B0E1E]/80 backdrop-blur-xl border-slate-800 py-2 shadow-2xl': scrolled && !mobileOpen,
          'bg-[#0B0E1E] py-4': !scrolled || mobileOpen,
        },
      )}
    >
      <nav className="flex h-12 items-center justify-between px-6 max-w-7xl mx-auto">
        <Link to="/" className="shrink-0">
          <img src="/mtx-logo.webp" alt="MTX Logo" className="h-8 w-auto" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {user && loggedInLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors',
                  isActive ? 'text-blue-500' : 'text-slate-300 hover:text-blue-400'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <Button asChild className="bg-[#2563EB] hover:bg-blue-700 text-white rounded-full px-5 shadow-lg shadow-blue-500/20 gap-2">
                <Link to="/deposit">
                  <ArrowDownLeft className="h-4 w-4" />
                  Deposit
                </Link>
              </Button>
              <Notifications />
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-white hover:text-blue-400 transition-colors">
                Sign In
              </Link>
              <Button asChild className="bg-[#2563EB] hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-500/20">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white md:hidden">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 top-[64px] bg-[#0B0E1E] z-[90] md:hidden px-6 pt-10 overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {user && loggedInLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cn(
                      'text-2xl font-semibold border-b border-slate-800 pb-4 transition-colors',
                      isActive ? 'text-blue-500' : 'text-white'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <>
                  <Button asChild className="w-full bg-[#2563EB] py-6 text-lg gap-2">
                    <Link to="/deposit" onClick={closeMobile}>
                      <ArrowDownLeft className="h-5 w-5" />
                      Deposit
                    </Link>
                  </Button>
                  {userMenuItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        cn(
                          'text-xl font-medium border-b border-slate-800 pb-4 flex items-center gap-3 transition-colors',
                          isActive ? 'text-blue-500' : 'text-white'
                        )
                      }
                    >
                      {item.icon}<span>{item.name}</span>
                    </NavLink>
                  ))}
                  <Button variant="destructive" className="w-full py-6 text-lg mt-2" onClick={() => { handleLogout(); closeMobile(); }}>
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full border-slate-700 text-white py-6 text-lg">
                    <Link to="/login" onClick={closeMobile}>Sign In</Link>
                  </Button>
                  <Button asChild className="w-full bg-[#2563EB] py-6 text-lg">
                    <Link to="/register" onClick={closeMobile}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
