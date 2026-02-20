import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, TrendingUp, Briefcase, Gift, Shield,
  KeyRound as UserRound, Camera, ChevronRight, Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { key: 'Trading', path: '/trading', icon: TrendingUp },
  { key: 'Portfolio', path: '/portfolio', icon: Briefcase },
  { key: 'Referral', path: '/referral', icon: Gift },
  { key: 'KYC', path: '/kyc', icon: UserRound },
];

function getInitials(profile, email) {
  if (profile?.first_name || profile?.last_name) {
    const f = (profile.first_name || '')[0] || '';
    const l = (profile.last_name || '')[0] || '';
    return (f + l).toUpperCase() || '?';
  }
  if (email) return email[0].toUpperCase();
  return '?';
}

function getDisplayName(profile, user) {
  if (profile?.first_name) {
    return [profile.first_name, profile.last_name].filter(Boolean).join(' ');
  }
  return user?.email || user?.phone || 'User';
}

const ProfileDropdown = () => {
  const { user, userProfile, signOut, uploadAvatar } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const closeTimeout = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 200);
  };

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    navigate('/');
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) return;
    if (file.size > 2 * 1024 * 1024) return;

    setUploading(true);
    await uploadAvatar(file);
    setUploading(false);
    e.target.value = '';
  };

  const avatarUrl = userProfile?.avatar_url;
  const initials = getInitials(userProfile, user?.email);
  const displayName = getDisplayName(userProfile, user);
  const displayEmail = user?.email || user?.phone || '';

  const items = [...menuItems];
  if (userProfile?.is_admin) {
    items.push({ key: 'Admin', path: '/admin', icon: Shield });
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative flex items-center justify-center h-9 w-9 rounded-full transition-all duration-200',
          'ring-2 ring-transparent hover:ring-blue-500/50 focus:outline-none focus:ring-blue-500/50',
          open && 'ring-blue-500/50'
        )}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
        )}
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0E1E]" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-700/60 bg-[#111427]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            <div className="p-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative group shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg font-semibold">
                      {initials}
                    </div>
                  )}
                  <button
                    onClick={handleAvatarClick}
                    disabled={uploading}
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                  <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-700/50" />

            <div className="py-1.5 px-1.5">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavigate(item.path)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors group"
                  >
                    <Icon className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    <span className="flex-1 text-left">{t(item.key)}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-slate-700/50" />

            <div className="p-1.5">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
