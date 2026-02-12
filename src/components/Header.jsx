import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, LogOut, KeyRound as UserRound, Globe, DollarSign, Menu, Briefcase, Gift, Shield, BarChart, TrendingUp, Home, ArrowDownLeft, ArrowUpRight, Download } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import Notifications from '@/components/Notifications';
const Header = ({
  onMenuClick
}) => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    user,
    userProfile,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const {
    currency,
    setCurrency,
    currencies
  } = useCurrency();
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  const navLinks = [{
    name: t('home'),
    path: '/',
    auth: false,
    icon: <Home className="mr-2 h-4 w-4" />
  }, {
    name: t('assets'),
    path: '/assets',
    auth: true,
    icon: <BarChart className="mr-2 h-4 w-4" />
  }, {
    name: t('portfolio'),
    path: '/portfolio',
    auth: true,
    icon: <Briefcase className="mr-2 h-4 w-4" />
  }, {
    name: t('deposit'),
    path: '/deposit',
    auth: true,
    icon: <ArrowDownLeft className="mr-2 h-4 w-4" />
  }, {
    name: t('withdraw'),
    path: '/withdraw',
    auth: true,
    icon: <ArrowUpRight className="mr-2 h-4 w-4" />
  }, {
    name: t('Download'),
    path: '/download',
    auth: false,
    icon: <Download className="mr-2 h-4 w-4" />
  }];
  const userMenuItems = [{
    name: t('Trading'),
    path: '/trading',
    icon: <TrendingUp className="mr-2 h-4 w-4" />
  }, {
    name: t('Portfolio'),
    path: '/portfolio',
    icon: <Briefcase className="mr-2 h-4 w-4" />
  }, {
    name: t('Referral'),
    path: '/referral',
    icon: <Gift className="mr-2 h-4 w-4" />
  }, {
    name: t('KYC'),
    path: '/kyc',
    icon: <UserRound className="mr-2 h-4 w-4" />
  }];
  if (userProfile?.is_admin) {
    userMenuItems.push({
      name: 'Admin',
      path: '/admin',
      icon: <Shield className="mr-2 h-4 w-4" />
    });
  }
  const activeLinkStyle = {
    color: '#3b82f6'
  };
  return <motion.header initial={{
    y: -100
  }} animate={{
    y: 0
  }} transition={{
    type: 'spring',
    stiffness: 50
  }} className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <img className="h-16 w-auto" alt="Logo" src="https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/untitled-design-14-IhAdk.png" />
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            {(user ? navLinks : navLinks.filter(l => !l.auth)).map(link => <NavLink key={link.name} to={link.path} style={({
            isActive
          }) => isActive ? activeLinkStyle : undefined} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-blue-500 transition-colors">
                {link.icon}{link.name}
              </NavLink>)}
          </nav>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {user && <div className="hidden sm:flex items-center">
                 <Notifications />
              </div>}
            <div className="hidden sm:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><Globe className="h-5 w-5 text-slate-300" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('selectLanguage')}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                    <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
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
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><DollarSign className="h-5 w-5 text-slate-300" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('selectCurrency')}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={currency} onValueChange={setCurrency}>
                    {Object.values(currencies).map(c => <DropdownMenuRadioItem key={c.name} value={c.name}>{c.symbol}</DropdownMenuRadioItem>)}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-300" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-300" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
            
            {user ? <div className="flex items-center">
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                       <img className="h-8 w-8 rounded-full" alt="User Profile Avatar" src="https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/f690e1d0d93b0b867b2388f44b298f21.png" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="w-56">
                     <DropdownMenuLabel className="truncate">{user.email || user.phone}</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     {userMenuItems.map(item => <DropdownMenuItem key={item.name} onClick={() => navigate(item.path)}>
                         {item.icon}<span>{item.name}</span>
                       </DropdownMenuItem>)}
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={handleLogout}>
                       <LogOut className="mr-2 h-4 w-4" />
                       <span>{t('logout')}</span>
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
              </div> : <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild><Link to="/login" className="text-slate-300 hover:text-blue-500">{t('login')}</Link></Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white"><Link to="/register">{t('register')}</Link></Button>
              </div>}
             <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={onMenuClick}>
                  <Menu className="h-6 w-6 text-slate-300" />
                </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>;
};
export default Header;