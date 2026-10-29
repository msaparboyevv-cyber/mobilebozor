import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, UserRound, X } from 'lucide-react';

export interface AccountUser {
  name: string;
  email: string;
  surname?: string;
  phone?: string;
}

interface StoredAccount extends AccountUser {
  salt: string;
  passwordHash: string;
}

interface AccountModalProps {
  mode: 'login' | 'register';
  account: AccountUser | null;
  onClose: () => void;
  onAuthenticated: (user: AccountUser) => void;
  onLogout: () => void;
}

const ACCOUNTS_KEY = 'mb_local_accounts';
const SESSION_KEY = 'mb_account_session';

async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function getAccounts(): StoredAccount[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((user): user is StoredAccount => Boolean(
      user && typeof user === 'object'
      && typeof user.name === 'string'
      && typeof user.email === 'string'
      && typeof user.salt === 'string'
      && typeof user.passwordHash === 'string',
    ));
  } catch {
    return [];
  }
}

export const AccountModal: React.FC<AccountModalProps> = ({ mode: initialMode, account, onClose, onAuthenticated, onLogout }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();
    const normalizedSurname = surname.trim();
    const normalizedPhone = phone.trim();

    if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('To‘g‘ri email manzilini kiriting.');
      return;
    }
    if (password.length < 8 || password.length > 256) {
      setError('Parol 8 dan 256 tagacha belgidan iborat bo‘lishi kerak.');
      return;
    }
    if (mode === 'register' && (normalizedName.length < 2 || normalizedName.length > 80)) {
      setError('Ism 2 dan 80 tagacha belgidan iborat bo‘lsin.');
      return;
    }
    if (mode === 'register' && (normalizedSurname.length < 2 || normalizedSurname.length > 80)) {
      setError('Familiya 2 dan 80 tagacha belgidan iborat bo‘lsin.');
      return;
    }
    if (mode === 'register' && !/^\+?[0-9\s()-]{9,18}$/.test(normalizedPhone)) {
      setError('To‘g‘ri telefon raqamini kiriting.');
      return;
    }
    if (!window.crypto?.subtle || !window.crypto?.getRandomValues) {
      setError('Demo akkaunt uchun HTTPS yoki localhost orqali kiring.');
      return;
    }

    setBusy(true);
    try {
      const accounts = getAccounts();
      const existing = accounts.find((user) => user.email === normalizedEmail);
      if (mode === 'register') {
        if (existing) {
          setError('Bu email qurilmada ro‘yxatdan o‘tgan. Kirish bo‘limidan foydalaning.');
          return;
        }
        const salt = Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('');
        const user: StoredAccount = { name: normalizedName, surname: normalizedSurname, phone: normalizedPhone, email: normalizedEmail, salt, passwordHash: await hashPassword(password, salt) };
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, user]));
        const session = { name: user.name, surname: user.surname, phone: user.phone, email: user.email };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        onAuthenticated(session);
      } else {
        const passwordMatches = existing && (await hashPassword(password, existing.salt)) === existing.passwordHash;
        if (!existing || !passwordMatches) {
          setError('Email yoki parol noto‘g‘ri.');
          return;
        }
        const session = { name: existing.name, surname: existing.surname, phone: existing.phone, email: existing.email };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        onAuthenticated(session);
      }
    } catch {
      setError('Akkaunt ma’lumotini saqlab yoki tekshirib bo‘lmadi. Brauzer xotirasi sozlamalarini tekshiring.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/80 p-2 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="account-modal-title" className="relative my-auto max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-[#12151e] p-4 text-white shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} disabled={busy} aria-label="Yopish" className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-50"><X className="h-5 w-5" /></button>
        {account ? (
          <div className="space-y-5 pt-2">
            <h2 id="account-modal-title" className="text-2xl font-black">Shaxsingiz</h2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-bold">{[account.name, account.surname].filter(Boolean).join(' ')}</p>
              <p className="mt-2 text-sm text-slate-300">{account.phone || 'Telefon raqami kiritilmagan'}</p>
              <p className="mt-1 break-all text-sm text-slate-400">{account.email}</p>
            </div>
            <p className="text-xs leading-relaxed text-amber-200/80">Bu demo akkaunt faqat shu brauzer qurilmasida saqlanadi; server hisobi emas.</p>
            <button type="button" onClick={onLogout} className="w-full rounded-xl border border-white/10 px-4 py-3 font-bold hover:border-amber-400/50">Akkauntdan chiqish</button>
          </div>
        ) : (
          <>
            <h2 id="account-modal-title" className="mb-2 pr-8 text-2xl font-black">{mode === 'login' ? 'Akkauntga kirish' : 'Ro‘yxatdan o‘tish'}</h2>
            <p className="mb-6 text-sm text-slate-400">{mode === 'login' ? 'Shu qurilmada saqlangan demo akkauntga kiring.' : 'Shu qurilmada demo akkaunt yarating.'}</p>
            <form onSubmit={handleSubmit} aria-busy={busy} className="space-y-4">
              {error && <p role="alert" aria-live="polite" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
              {mode === 'register' && <label className="block text-xs font-semibold text-slate-300">Ism
                <span className="relative mt-1 block"><UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input required minLength={2} maxLength={80} autoComplete="given-name" value={name} onChange={(event) => setName(event.target.value)} className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0d1019] py-2.5 pl-10 pr-3 text-base text-white outline-none focus:border-amber-400" /></span>
              </label>}
              {mode === 'register' && <label className="block text-xs font-semibold text-slate-300">Familiya
                <span className="relative mt-1 block"><UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input required minLength={2} maxLength={80} autoComplete="family-name" value={surname} onChange={(event) => setSurname(event.target.value)} className="min-h-11 w-full rounded-xl border border-white/10 bg-[#0d1019] py-2.5 pl-10 pr-3 text-base text-white outline-none focus:border-amber-400" /></span>
              </label>}
              {mode === 'register' && <label className="block text-xs font-semibold text-slate-300">Telefon raqami
                <input required type="tel" inputMode="tel" autoComplete="tel" maxLength={18} placeholder="+998 90 123 45 67" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-white/10 bg-[#0d1019] px-3 py-2.5 text-base text-white outline-none focus:border-amber-400" />
              </label>}
              <label className="block text-xs font-semibold text-slate-300">Email
                <span className="relative mt-1 block"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0d1019] py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-amber-400" /></span>
              </label>
              <label className="block text-xs font-semibold text-slate-300">Parol
                <span className="relative mt-1 block"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input required minLength={8} maxLength={256} type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0d1019] py-2.5 pl-10 pr-14 text-sm text-white outline-none focus:border-amber-400" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'} aria-pressed={showPassword} className="absolute right-1 top-1/2 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-400 hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span>
              </label>
              <p className="text-[11px] leading-relaxed text-amber-200/70">Demo ma’lumotlari faqat shu qurilma brauzerida saqlanadi. Parolni tiklash va boshqa qurilmada kirish mavjud emas.</p>
              <button disabled={busy} type="submit" aria-busy={busy} className="w-full rounded-xl bg-amber-400 px-4 py-3 font-extrabold text-black hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60">{busy ? 'Tekshirilmoqda…' : mode === 'login' ? 'Kirish' : 'Akkaunt yaratish'}</button>
            </form>
            <button type="button" disabled={busy} onClick={() => { setError(''); setPassword(''); setShowPassword(false); setMode(mode === 'login' ? 'register' : 'login'); }} className="mt-4 w-full text-center text-sm font-semibold text-amber-300 hover:text-amber-200 disabled:opacity-50">{mode === 'login' ? 'Akkauntingiz yo‘qmi? Ro‘yxatdan o‘ting' : 'Akkauntingiz bormi? Kirish'}</button>
          </>
        )}
      </section>
    </div>
  );
};
