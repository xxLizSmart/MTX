import React from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark, Users, BarChart3, Wallet, HelpCircle, X, Home, ArrowDownLeft, ArrowUpRight, LogIn, UserPlus, Gift, Shield, Download, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const sidebarVariants = {
  open: { x: 0 },
  closed: { x: "-100%" },
};

const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
};

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate('/');
  };

  const commonNavItems = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, path: '/', auth: false },
    { name: 'Download App', icon: <Download className="h-5 w-5" />, path: '/download', auth: false },
  ];

  const loggedInNavItems = [
    { name: 'Assets', icon: <Landmark className="h-5 w-5" />, path: '/assets', auth: true },
    { name: 'Trading', icon: <BarChart3 className="h-5 w-5" />, path: '/trading', auth: true },
    { name: 'Portfolio', icon: <Wallet className="h-5 w-5" />, path: '/portfolio', auth: true },
    { name: 'Deposit', icon: <ArrowDownLeft className="h-5 w-5" />, path: '/deposit', auth: true },
    { name: 'Withdraw', icon: <ArrowUpRight className="h-5 w-5" />, path: '/withdraw', auth: true },
    { name: 'KYC', icon: <Users className="h-5 w-5" />, path: '/kyc', auth: true },
    { name: 'Referral', icon: <Gift className="h-5 w-5" />, path: '/referral', auth: true },
    ...(userProfile?.is_admin ? [{ name: 'Admin', icon: <Shield className="h-5 w-5" />, path: '/admin', auth: true }] : []),
    { name: 'Help', icon: <HelpCircle className="h-5 w-5" />, path: 'https://direct.lc.chat/19302865/', type: 'external' },
  ];
  
  const loggedOutNavItems = [
    { name: 'Login', icon: <LogIn className="h-5 w-5" />, path: '/login', auth: false },
    { name: 'Register', icon: <UserPlus className="h-5 w-5" />, path: '/register', auth: false },
  ];

  const navItems = [...commonNavItems, ...(user ? loggedInNavItems : loggedOutNavItems)];

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.path;
    const className = cn(
      "flex items-center text-lg font-medium transition-colors duration-200 p-4 rounded-lg",
      isActive ? "text-primary bg-primary/10" : "text-foreground hover:bg-muted"
    );

    if (item.type === 'external') {
      return (
        <a key={item.name} href={item.path} target="_blank" rel="noopener noreferrer" className={className}>
          {item.icon}
          <span className="ml-4">{item.name}</span>
        </a>
      );
    }
    
    return (
       <NavLink key={item.name} to={item.path} className={className} onClick={onClose}>
        {item.icon}
        <span className="ml-4">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      <motion.div
        variants={backdropVariants}
        initial="closed"
        animate="open"
        exit="closed"
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[90] md:hidden"
      />
      <motion.nav
        variants={sidebarVariants}
        initial="closed"
        animate="open"
        exit="closed"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-background/95 backdrop-blur-lg border-r border-border/50 z-[100] md:hidden flex flex-col p-6"
      >
        <div className="flex items-center justify-between mb-8">
            <Link to="/" onClick={onClose} className="flex items-center space-x-2">
                <img className="h-12 w-auto" alt="Logo" src="https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/x-1-27r9c.png" />
            </Link>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-2">
            {navItems.map(renderNavItem)}
        </div>

        <div className="mt-auto">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <span className="text-foreground font-medium">Toggle Theme</span>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
            {user && (
                <Button variant="destructive" className="w-full mt-4" onClick={handleLogout}>
                    Logout
                </Button>
            )}
        </div>
      </motion.nav>
    </>
  );
};

export default Sidebar;