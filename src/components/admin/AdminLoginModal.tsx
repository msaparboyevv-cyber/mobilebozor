import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  adminPassword: string;
  ownerEmail: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  adminPassword,
  ownerEmail,
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState(ownerEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailOrUsername.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check against authorized owner email/username and password
    const isOwnerAuthorized =
      cleanEmail === ownerEmail.toLowerCase() ||
      cleanEmail === 'admin' ||
      cleanEmail === 'msaparboyevv';

    if (isOwnerAuthorized && Boolean(adminPassword) && cleanPassword === adminPassword) {
      setError('');
      if (rememberMe) {
        try { localStorage.setItem('mb_admin_authenticated', 'true'); } catch { /* Private browsing can disable storage. */ }
      }
      onLoginSuccess();
    } else {
      setError('Login yoki maxfiy parol noto\'g\'ri! Faqat bosh administrator kirishi mumkin.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 10 }}
        transition={{ duration: 0.22 }}
        className="relative w-full max-w-md bg-[#12151e] border border-white/[0.12] rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Admin Tizimiga Kirish</h2>
          <p className="text-xs text-slate-400">
            Faqat tizim egasi ({ownerEmail}) uchun himoyalangan boshqaruv paneli.
          </p>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Login / Email
            </label>
            <input
              type="text"
              required
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="msaparboyevv@gmail.com"
              className="w-full py-3 px-3.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs font-medium text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Maxfiy Parol
              </label>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting..."
                className="w-full py-3 pl-3.5 pr-10 rounded-xl bg-black/40 border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-400"
              />
              <span>Meni eslab qolish</span>
            </label>
            <span className="text-slate-500 text-[11px]">Parol qurilma xotirasida tekshiriladi</span>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 px-4 text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Admin panelga kirish</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </form>

      </motion.div>
    </div>
  );
};
