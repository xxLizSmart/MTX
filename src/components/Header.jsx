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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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
            animate={{ opacity: 1, height: 'calc(100vh - 64px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 top-[64px] bg-[#0B0E1E] z-[90] md:hidden px-6 pt-6 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto space-y-1">
              {user && loggedInLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cn(
                      'block text-xl font-semibold border-b border-slate-800 py-4 transition-colors min-h-[44px]',
                      isActive ? 'text-blue-500' : 'text-white'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {user && (
                <>
                  <NavLink
                    to="/deposit"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      cn(
                        'text-xl font-semibold border-b border-slate-800 py-4 transition-colors min-h-[44px] flex items-center gap-3',
                        isActive ? 'text-blue-500' : 'text-white'
                      )
                    }
                  >
                    <ArrowDownLeft className="h-5 w-5" />Deposit
                  </NavLink>
                  {userMenuItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        cn(
                          'text-lg font-medium border-b border-slate-800 py-4 flex items-center gap-3 transition-colors min-h-[44px]',
                          isActive ? 'text-blue-500' : 'text-white'
                        )
                      }
                    >
                      {item.icon}<span>{item.name}</span>
                    </NavLink>
                  ))}
                </>
              )}
            </div>

            <div className="shrink-0 pb-8 pt-4 space-y-3">
              {user ? (
                <Button variant="destructive" className="w-full min-h-[48px] text-base" onClick={() => { handleLogout(); closeMobile(); }}>
                  {t('logout')}
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full border-slate-700 text-white min-h-[48px] text-base">
                    <Link to="/login" onClick={closeMobile}>Sign In</Link>
                  </Button>
                  <Button asChild className="w-full bg-[#2563EB] min-h-[48px] text-base">
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
