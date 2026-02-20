import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, LogOut, KeyRound as UserRound, Globe, DollarSign,
  Menu, X, Briefcase, Gift, Shield, TrendingUp,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import Notifications from '@/components/Notifications';
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

const WordmarkIcon = (props) => (
  <svg viewBox="0 0 84 24" fill="currentColor" {...props}>
    <path d="M45.035 23.984c-1.34-.062-2.566-.441-3.777-1.16-1.938-1.152-3.465-3.187-4.02-5.36-.199-.784-.238-1.128-.234-2.058 0-.691.008-.87.062-1.207.23-1.5.852-2.883 1.852-4.144.297-.371 1.023-1.09 1.41-1.387 1.399-1.082 2.84-1.68 4.406-1.816.536-.047 1.528-.02 2.047.054 1.227.184 2.227.543 3.106 1.121 1.277.84 2.5 2.184 3.367 3.7.098.168.172.308.172.312-.004 0-1.047.723-2.32 1.598l-2.711 1.867c-.61.422-2.91 2.008-2.993 2.062l-.074.047-1-1.574c-.55-.867-1.008-1.594-1.012-1.61-.007-.019.922-.648 2.188-1.476 1.215-.793 2.2-1.453 2.191-1.46-.02-.032-.508-.27-.691-.34a5 5 0 0 0-.465-.13c-.371-.09-1.105-.125-1.426-.07-1.285.219-2.336 1.3-2.777 2.852-.215.761-.242 1.636-.074 2.355.129.527.383 1.102.691 1.543.234.332.727.82 1.047 1.031.664.434 1.195.586 1.969.555.613-.023 1.027-.129 1.64-.426 1.184-.574 2.16-1.554 2.828-2.843.122-.235.208-.372.227-.368.082.032 3.77 1.938 3.79 1.961.034.032-.407.93-.696 1.414a12 12 0 0 1-1.051 1.477c-.36.422-1.102 1.14-1.492 1.445a9.9 9.9 0 0 1-3.23 1.684 9.2 9.2 0 0 1-2.95.351M74.441 23.996c-1.488-.043-2.8-.363-4.066-.992-1.687-.848-2.992-2.14-3.793-3.774-.605-1.234-.863-2.402-.863-3.894.004-1.149.176-2.156.527-3.11.14-.378.531-1.171.75-1.515 1.078-1.703 2.758-2.934 4.805-3.524.847-.242 1.465-.332 2.433-.351 1.032-.024 1.743.055 2.48.277l.31.09.007 2.48c.004 1.364 0 2.481-.008 2.481a1 1 0 0 1-.12-.055c-.688-.347-2.09-.488-2.962-.296-.754.167-1.296.453-1.785.945a3.7 3.7 0 0 0-1.043 2.11c-.047.382-.02 1.109.055 1.437a3.4 3.4 0 0 0 .941 1.738c.75.75 1.715 1.102 2.875 1.05.645-.03 1.118-.14 1.563-.366q1.721-.864 2.02-3.145c.035-.293.042-1.266.042-7.957V0H84l-.012 8.434c-.008 7.851-.011 8.457-.054 8.757-.196 1.274-.586 2.25-1.301 3.243-1.293 1.808-3.555 3.07-6.145 3.437-.664.098-1.43.14-2.047.125M9.848 23.574a14 14 0 0 1-1.137-.152c-2.352-.426-4.555-1.781-6.117-3.774-.27-.335-.75-1.05-.95-1.406-1.156-2.047-1.695-4.27-1.64-6.77.047-1.995.43-3.66 1.23-5.316.524-1.086 1.04-1.87 1.793-2.715C4.567 1.72 6.652.535 8.793.171 9.68.02 10.093 0 12.297 0h1.789v5.441l-.961.016c-2.36.04-3.441.215-4.441.719-.836.414-1.278.879-1.895 1.976-.219.399-.535 1.02-.535 1.063 0 .02 1.285.027 3.918.027h3.914v5.113h-3.914c-2.54 0-3.918.008-3.918.028 0 .05.254.597.441.953.344.656.649 1.086 1.051 1.48.668.657 1.356.985 2.445 1.16.645.106 1.274.145 2.61.16l1.285.016v5.442l-2.055-.004a120 120 0 0 1-2.183-.016M16.469 14.715c0-5.504.011-9.04.031-9.29a5.54 5.54 0 0 1 1.527-3.48c.778-.82 1.922-1.457 3.118-1.734C21.915.035 22.422 0 24.39 0h1.652v4.914h-1.426c-1.324 0-1.445.004-1.644.055-.739.191-1.059.699-1.106 1.754l-.015.355h4.191v4.914h-4.184v11.602h-5.39ZM27.023 14.727c0-5.223.012-9.04.028-9.278.129-1.98 1.234-3.68 3.012-4.62.87-.462 1.777-.716 2.851-.802A61 61 0 0 1 34.945 0h1.649v4.914h-1.426c-1.32 0-1.441.004-1.64.055-.739.191-1.063.699-1.106 1.754l-.02.355h4.192v4.914H32.41v11.602h-5.387ZM55.48 15.406V7.22h4.66v1.363c0 1.3.005 1.363.051 1.363.04 0 .075-.054.133-.203.38-.98.969-1.68 1.711-2.031.563-.266 1.422-.43 2.492-.48l.414-.02v4.914l-.414.035c-.738.063-1.597.195-2.058.313-.297.082-.688.28-.875.449-.324.289-.532.703-.625 1.254-.094.547-.098.879-.098 5.144v4.274h-5.39Zm0 0" />
  </svg>
);

const publicLinks = [
  { label: 'Markets', href: '/assets' },
  { label: 'Trade', href: '/trading' },
  { label: 'Features', href: '/features' },
  { label: 'About', href: '/about' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScroll(20);
  const { theme, toggleTheme } = useTheme();
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, currencies } = useCurrency();

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
          <WordmarkIcon className="h-6 text-white" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {publicLinks.map((link) => (
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

          <div className="h-4 w-[1px] bg-slate-700 mx-2" />

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                  <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="es">Espanol</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="de">Deutsch</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="it">Italiano</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ru">Русский</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ko">한국어</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="zh">中文</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ja">日本語</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                  <DollarSign className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('selectCurrency')}</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={currency} onValueChange={setCurrency}>
                  {Object.values(currencies).map((c) => (
                    <DropdownMenuRadioItem key={c.name} value={c.name}>
                      {c.symbol}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-300 hover:text-white">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Notifications />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <img
                      className="h-8 w-8 rounded-full"
                      alt="User Profile Avatar"
                      src="https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/f690e1d0d93b0b867b2388f44b298f21.png"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email || user.phone}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.name} onClick={() => navigate(item.path)}>
                      {item.icon}<span>{item.name}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
              {publicLinks.map((link) => (
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
