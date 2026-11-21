import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { AuthProvider, UserProfile } from '../types';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  user?: UserProfile;
  onLoginSuccess?: (provider: AuthProvider, email?: string, name?: string) => void;
  onAuthSuccess?: (authenticatedUser: UserProfile) => void;
}

export function AuthModal({ isOpen, onClose, currentUser, user, onLoginSuccess, onAuthSuccess }: AuthModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AuthProvider | null>(null);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  const activeUser = currentUser || user;

  if (!isOpen) return null;

  const handleProviderLogin = (provider: AuthProvider) => {
    setSelectedProvider(provider);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onLoginSuccess) {
        onLoginSuccess(provider);
      }
      if (onAuthSuccess && activeUser) {
        onAuthSuccess({
          ...activeUser,
          verifiedAuthMethod: provider,
        });
      }
      onClose();
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const emailName = emailInput.split('@')[0];
      if (onLoginSuccess) {
        onLoginSuccess('email', emailInput, emailName);
      }
      if (onAuthSuccess && activeUser) {
        onAuthSuccess({
          ...activeUser,
          email: emailInput,
          name: emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : activeUser.name,
          verifiedAuthMethod: 'email',
        });
      }
      onClose();
    }, 600);
  };


  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div id="auth-modal-card" className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-slate-800">
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to MNC Pro
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Authenticate to sync your Tier-1 MNC preparation & AI influence metrics
          </p>
        </div>

        {/* Current Authenticated Status if logged in */}
        {currentUser && (
          <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/50 dark:bg-blue-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    Verified with {currentUser.verifiedAuthMethod}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Active Session
              </span>
            </div>
          </div>
        )}

        {/* Social Authentication Buttons */}
        <div className="space-y-2.5">
          {/* Google / Gmail */}
          <button
            id="btn-auth-google"
            onClick={() => handleProviderLogin('google')}
            disabled={isSubmitting}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
          >
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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
              <span>Continue with Google / Gmail</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </button>

          {/* Apple */}
          <button
            id="btn-auth-apple"
            onClick={() => handleProviderLogin('apple')}
            disabled={isSubmitting}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.66 1.38-.56.65-1.06 1.71-0.93 2.74 1.04.08 2.07-.5 2.67-1.25z" />
              </svg>
              <span>Continue with Apple ID</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </button>

          {/* Twitter / X */}
          <button
            id="btn-auth-twitter"
            onClick={() => handleProviderLogin('twitter')}
            disabled={isSubmitting}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Continue with Twitter / X</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </button>

          {/* Social / LinkedIn Auth */}
          <button
            id="btn-auth-social"
            onClick={() => handleProviderLogin('social')}
            disabled={isSubmitting}
            className="flex w-full items-center justify-between rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-100/70 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200"
          >
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74V9.93H5.06v8.57z" />
              </svg>
              <span>Connect via LinkedIn Social Pro</span>
            </div>
            <Sparkles className="h-4 w-4 text-blue-600" />
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Or use email</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Direct Email Access Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Work Email</label>
            <input
              id="input-auth-email"
              type="email"
              placeholder="candidate@company.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            id="btn-auth-email-submit"
            type="submit"
            disabled={isSubmitting || !emailInput}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {isSubmitting ? 'Authenticating...' : 'Instant 1-Click Access'}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Encrypted 256-bit authentication. By continuing, you agree to MNC Pro Career Terms.
        </p>
      </div>
    </div>
  );
}
