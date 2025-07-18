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
      className="h-screen bg-vscode-bg overflow-hidden"
      style={{ 
        height: '100dvh',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {user ? <Dashboard /> : <AuthForm />}
    </main>
  );
}
