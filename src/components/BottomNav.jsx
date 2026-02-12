import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Wallet, BarChart3, Users, Landmark, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Assets', icon: <Landmark className="h-5 w-5" />, path: '/assets', type: 'link' },
    { name: 'KYC', icon: <Users className="h-5 w-5" />, path: '/kyc', type: 'link' },
    { name: 'Trading', icon: <BarChart3 className="h-6 w-6" />, path: '/trading', highlight: true, type: 'link' },
    { name: 'Portfolio', icon: <Wallet className="h-5 w-5" />, path: '/portfolio', type: 'link' },
    { name: 'Help', icon: <HelpCircle className="h-5 w-5" />, path: 'https://direct.lc.chat/19302865/', type: 'external' },
  ];

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.path || (item.path === '/trading' && location.pathname.startsWith('/trading'));
    const className = cn(
      "flex flex-col items-center justify-center text-xs font-medium transition-colors duration-200 flex-1",
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
      item.highlight ? "relative -top-4" : ""
    );

    if (item.type === 'external') {
      return (
        <a
          key={item.name}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {item.icon}
          <span className="mt-1">{item.name}</span>
        </a>
      );
    }
    
    return (
       <NavLink
        key={item.name}
        to={item.path}
        className={className}
      >
        {item.highlight ? (
          <div className={cn(
            "relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg",
            isActive ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" : "bg-secondary text-secondary-foreground"
          )}>
            {item.icon}
          </div>
        ) : (
          <>
            {item.icon}
            <span className="mt-1">{item.name}</span>
          </>
        )}
      </NavLink>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border/50 z-50 md:hidden">
      <div className="flex justify-around items-center h-16 max-w-full mx-auto px-2">
        {navItems.map(renderNavItem)}
      </div>
    </nav>
  );
};

export default BottomNav;