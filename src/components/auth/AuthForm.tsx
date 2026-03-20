'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import StudyHubLogo from '@/components/branding/StudyHubLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.displayName);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle compact />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-float absolute left-0 top-12 h-72 w-72 rounded-full bg-primary-200/50 blur-3xl" />
        <div className="ambient-float motion-delay-1 absolute right-8 top-1/3 h-80 w-80 rounded-full bg-accent-200/45 blur-3xl" />
      </div>

      <div className="app-shell motion-scale-in relative grid w-full max-w-6xl overflow-hidden md:grid-cols-[1.1fr_1fr]">
        <section className="motion-slide-in-left hidden border-r border-secondary-700/90 bg-gradient-to-br from-secondary-950 to-secondary-900 px-10 py-12 md:block">
          <StudyHubLogo size={52} />

          <h2 className="mt-10 max-w-md text-4xl font-semibold leading-tight text-secondary-100" style={{ fontFamily: 'var(--font-sora)' }}>
            Learn with structure.
            <br />
            Execute with clarity.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-secondary-400">
            StudyHub gives you one professional workspace for topic planning, task execution, reminders, and notes.
          </p>

          <div className="mt-10 space-y-3">
            {[
              'Focused dashboards for each topic',
              'Prioritized task and reminder workflow',
              'Fast switching across desktop and mobile',
            ].map((item, index) => (
              <div
                key={item}
                className="surface-soft motion-fade-up motion-lift flex items-center gap-3 px-4 py-3"
                style={{ animationDelay: `${100 + index * 60}ms` }}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                <span className="text-sm text-secondary-200">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="motion-fade-up motion-delay-1 bg-secondary-950/92 p-6 sm:p-8 md:p-10">
          <div className="motion-fade-up mx-auto w-full max-w-md">
            <div className="motion-fade-up mb-7 md:hidden">
              <StudyHubLogo size={46} />
            </div>

            <div className="surface motion-scale-in p-1.5">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`touch-target motion-lift rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                    isLogin ? 'bg-primary-500 text-white' : 'text-secondary-300 hover:bg-secondary-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`touch-target motion-lift rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                    !isLogin ? 'bg-primary-500 text-white' : 'text-secondary-300 hover:bg-secondary-800'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="motion-fade-up motion-delay-2 mt-6 space-y-4">
              {!isLogin && (
                <div className="motion-fade-up">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-secondary-400">Display Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full rounded-xl border border-secondary-700 bg-secondary-900 px-3.5 py-3 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
                    placeholder="Your name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-secondary-400">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-secondary-700 bg-secondary-900 px-3.5 py-3 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-secondary-400">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-secondary-700 bg-secondary-900 px-3.5 py-3 pr-12 text-sm text-secondary-100 placeholder:text-secondary-500 focus:border-primary-500 focus:outline-none"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="touch-target motion-lift absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-2 text-secondary-400 hover:text-secondary-200"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary touch-target motion-lift w-full">
                {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="motion-fade-up motion-delay-3 my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-secondary-500">
              <span className="h-px flex-1 bg-secondary-700" />
              <span>Or</span>
              <span className="h-px flex-1 bg-secondary-700" />
            </div>

            <button onClick={handleGoogleSignIn} disabled={loading} className="btn-secondary touch-target motion-lift w-full">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthForm;
