'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm';
import Dashboard from '@/components/dashboard/Dashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="h-screen overflow-hidden" style={{ height: '100dvh' }}>
      {user ? <Dashboard /> : <AuthForm />}
    </main>
  );
}
