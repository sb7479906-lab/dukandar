import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

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

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    loginUser(email.trim(), 'customer');
    setIsAuthOpen(false);
  };

  const handleDemoCustomerLogin = () => {
    loginUser('daniyal.pk@gmail.com', 'customer');
    setIsAuthOpen(false);
  };

  const handleDemoAdminLogin = () => {
    loginUser('admin@dukandar.pk', 'admin');
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

        <div className="p-6 space-y-5">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
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
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
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
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
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
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-sm"
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
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              ⚡ 1-Click Instant Demo Profiles
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDemoCustomerLogin}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Demo Customer</span>
              </button>

              <button
                onClick={handleDemoAdminLogin}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
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
