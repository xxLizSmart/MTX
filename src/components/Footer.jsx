import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, MessageSquare, Download } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900/80 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="hidden md:grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img className="h-16 w-auto" alt="Logo" src="https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/8e3fab2331b228c8a38bbe45c8541a8d.png" />
            </div>
            <p className="text-muted-foreground max-w-md">{t('subtitle')}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4">Company</p>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4">Legal</p>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">{t('terms')}</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">{t('privacy')}</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4">App</p>
            <ul className="space-y-3">
              <li>
                <Link to="/download" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-4">Contact Us</p>
            <div className="flex space-x-4">
              <a href="mailto:cs.helpdesk@metatradex.net" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://direct.lc.chat/19302865/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="md:mt-12 md:border-t md:border-border/50 md:pt-8 text-center">
          <p className="text-sm text-muted-foreground">&copy; 2019-{currentYear > 2025 ? currentYear : 2025} MetaTradeX. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;