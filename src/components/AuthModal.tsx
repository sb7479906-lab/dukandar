import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { loginWithGoogle } from '../lib/firebase';

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    loginUser,
    language,
    t,
    setActiveView,
  } = useStore();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    loginUser(email.trim(), 'customer', name.trim() || undefined);
    setIsAuthOpen(false);
  };

  // Live Firebase Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const user = await loginWithGoogle();
      if (user && user.email) {
        loginUser(user.email, 'customer', user.displayName || undefined, user.photoURL || undefined);
        setIsAuthOpen(false);
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      alert(language === 'ur' ? 'گوگل لاگ ان ناکام ہو گیا!' : 'Google Sign-In failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomerLogin = () => {
    loginUser('daniyal.pk@gmail.com', 'customer', 'Muhammad Daniyal');
    setIsAuthOpen(false);
  };

  const handleDemoAdminLogin = () => {
    loginUser('admin@dukandar.pk', 'admin', 'Store Admin');
    setIsAuthOpen(false);
    setActiveView('admin');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isLoginMode ? (language === 'ur' ? 'کسٹمر لاگ ان' : 'Customer Login') : (language === 'ur' ? 'نیا اکاؤنٹ بنائیں' : 'Create Account')}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ur' ? 'آرڈرز کی تاریخ اور معلومات دیکھیں' : 'Track orders & manage saved details'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Google Sign-In Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-300 flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-xs text-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? 'Connecting...' : (language === 'ur' ? 'گوگل سے لاگ ان کریں' : 'Continue with Google')}</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
              {language === 'ur' ? 'یا ای میل سے' : 'or email'}
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLoginMode && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('fullName')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Daniyal"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t('emailAddress')} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === 'ur' ? 'پاس ورڈ' : 'Password'} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-sm"
            >
              <span>{isLoginMode ? t('login') : (language === 'ur' ? 'رجسٹر کریں' : 'Register')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center text-xs text-slate-500">
            {isLoginMode ? (
              <span>
                {language === 'ur' ? 'اکاؤنٹ نہیں ہے؟' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsLoginMode(false)}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  {language === 'ur' ? 'نیا اکاؤنٹ بنائیں' : 'Sign Up'}
                </button>
              </span>
            ) : (
              <span>
                {language === 'ur' ? 'پہلے سے رجسٹرڈ ہیں؟' : 'Already have an account?'}{' '}
                <button
                  onClick={() => setIsLoginMode(true)}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  {t('login')}
                </button>
              </span>
            )}
          </div>

          {/* 1-Click Fast Demo Logins */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              ⚡ 1-Click Instant Demo Profiles
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDemoCustomerLogin}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Demo Customer</span>
              </button>

              <button
                onClick={handleDemoAdminLogin}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
