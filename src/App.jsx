import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import lazyWithPreload from 'react-lazy-with-preload';
import Sidebar from '@/components/Sidebar';
import Loader from '@/components/Loader';

const Home = lazyWithPreload(() => import('@/pages/Home'));
const Login = lazyWithPreload(() => import('@/pages/Login'));
const Register = lazyWithPreload(() => import('@/pages/Register'));
const ForgotPassword = lazyWithPreload(() => import('@/pages/ForgotPassword'));
const UpdatePassword = lazyWithPreload(() => import('@/pages/UpdatePassword'));
const Trading = lazyWithPreload(() => import('@/pages/Trading'));
const Portfolio = lazyWithPreload(() => import('@/pages/Portfolio'));
const Deposit = lazyWithPreload(() => import('@/pages/Deposit'));
const Withdraw = lazyWithPreload(() => import('@/pages/Withdraw'));
const KYC = lazyWithPreload(() => import('@/pages/KYC'));
const Privacy = lazyWithPreload(() => import('@/pages/Privacy'));
const Terms = lazyWithPreload(() => import('@/pages/Terms'));
const Assets = lazyWithPreload(() => import('@/pages/Assets'));
const CoinSwapper = lazyWithPreload(() => import('@/pages/CoinSwapper'));
const Referral = lazyWithPreload(() => import('@/pages/Referral'));
const Admin = lazyWithPreload(() => import('@/pages/Admin'));
const Charting = lazyWithPreload(() => import('@/pages/Charting'));
const HowItWorks = lazyWithPreload(() => import('@/pages/HowItWorks'));
const About = lazyWithPreload(() => import('@/pages/About'));
const Features = lazyWithPreload(() => import('@/pages/Features'));
const Download = lazyWithPreload(() => import('@/pages/Download'));

const pageVariants = {
  initial: { opacity: 0, filter: 'blur(4px)' },
  in: { opacity: 1, filter: 'blur(0px)' },
  out: { opacity: 0, filter: 'blur(4px)' }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const authRoutes = [Login, Register, ForgotPassword];
const coreRoutes = [Home, Assets, Trading, Portfolio];

const AnimatedRoutes = () => {
    const location = useLocation();

    useEffect(() => {
      const path = location.pathname;
      if (path === '/login' || path === '/register' || path === '/forgot-password') {
        authRoutes.forEach((r) => r.preload());
      } else if (path === '/') {
        coreRoutes.forEach((r) => r.preload());
      }
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div></div>}>
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/update-password" element={<UpdatePassword />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/download" element={<Download />} />
                        <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
                        <Route path="/trading" element={<ProtectedRoute><Trading /></ProtectedRoute>} />
                        <Route path="/trading/:symbol" element={<ProtectedRoute><Trading /></ProtectedRoute>} />
                        <Route path="/charting/:symbol" element={<ProtectedRoute><Charting /></ProtectedRoute>} />
                        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
                        <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
                        <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
                        <Route path="/kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
                        <Route path="/swap" element={<ProtectedRoute><CoinSwapper /></ProtectedRoute>} />
                        <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
                    </Routes>
                </Suspense>
            </motion.div>
        </AnimatePresence>
    )
}


function App() {
  const { theme } = useTheme();
  const location = useLocation();
  const isChartingPage = location.pathname.startsWith('/charting');
  const isHomePage = location.pathname === '/';
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const minDelay = new Promise((r) => setTimeout(r, 2000));
    const windowLoad = new Promise((r) => {
      if (document.readyState === 'complete') r();
      else window.addEventListener('load', r, { once: true });
    });
    Promise.all([minDelay, windowLoad]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex flex-col ${theme} ${isChartingPage ? 'charting-view' : ''}`}>
      <Loader visible={loading} />
      <div className="main-background"></div>
      <div className="main-background-overlay"></div>
      <div className="bg-transparent text-foreground flex-grow relative z-10">
        {!isChartingPage && <Header onMenuClick={() => setSidebarOpen(true)} />}
        <AnimatePresence>
          {isSidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
        </AnimatePresence>
        <main className={!isChartingPage && !isHomePage ? "pt-20 pb-16 md:pb-0" : ""}>
            <AnimatedRoutes />
        </main>
        {!isChartingPage && <Footer />}
      </div>
    </div>
  );
}

export default App;