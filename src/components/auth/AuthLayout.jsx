import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import DotMap from './DotMap';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0E1E] p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-[#111827] border border-slate-800 shadow-2xl shadow-blue-900/20"
      >
        <div className="hidden md:block w-1/2 relative overflow-hidden bg-[#0F172A] border-r border-slate-800 min-h-[500px]">
          <DotMap />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 text-center">
            <div className="h-16 w-16 rounded-2xl bg-[#2563EB] flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
              <Shield className="text-white h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">MTX Trading</h2>
            <p className="text-slate-400 text-sm max-w-xs">
              Secure access to the world's most advanced asset trading dashboard.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-10 bg-[#111827]">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
