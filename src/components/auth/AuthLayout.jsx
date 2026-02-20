import React from 'react';
import { motion } from 'framer-motion';
import DotMap from './DotMap';

const LOGO_URL = 'https://horizons-cdn.hostinger.com/911b6dd9-a6dc-482b-b727-f1a7cb5e689b/8e3fab2331b228c8a38bbe45c8541a8d.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0E1E] p-0 md:p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:max-w-4xl overflow-hidden md:rounded-2xl flex bg-[#111827] md:border md:border-slate-800 md:shadow-2xl md:shadow-blue-900/20 min-h-screen md:min-h-0"
      >
        <div className="hidden md:block w-1/2 relative overflow-hidden bg-[#0F172A] border-r border-slate-800 min-h-[500px]">
          <DotMap />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 text-center">
            <img
              src={LOGO_URL}
              alt="MetaTradeX"
              className="h-20 w-auto mb-6 drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            />
            <p className="text-slate-400 text-sm max-w-xs">
              Secure access to the world's most advanced asset trading dashboard.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-6 py-8 sm:p-10 bg-[#111827] flex flex-col justify-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
