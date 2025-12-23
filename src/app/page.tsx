'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main
      className="h-screen bg-secondary-50 dark:bg-secondary-900 overflow-hidden relative"
      style={{
        height: '100dvh',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-secondary-50 via-secondary-100 to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900"></div>
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-200/20 dark:bg-secondary-700/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 h-full">
        {user ? <Dashboard /> : <AuthForm />}
      </div>
    </main>
  );
}
