"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { CircleUserRound } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (!user && !isAuthPage) {
      router.push('/login');
    }

    if (user && isAuthPage) {
      // User is logged in and on an auth page, redirect them
      router.push(isAdmin ? '/dashboard' : '/new-query');
    }
    
    // If a non-admin user tries to access the dashboard, redirect them
    if (user && !isAdmin && pathname === '/dashboard') {
        router.push('/new-query');
    }
    
  }, [user, loading, router, pathname, isAdmin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-grow">
          <CircleUserRound className="h-16 w-16 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground">Verificando sesión...</p>
      </div>
    );
  }

  // If there's no user and we're not on an auth page, we'll show nothing
  // as the useEffect will handle the redirection. This prevents a flash of
  // content that shouldn't be visible.
  if (!user && !(pathname === '/login' || pathname === '/register')) {
    return null;
  }
  
  // If user is on login or register page, render the page, which is the children.
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }


  // If the user is logged in, show the content.
  // The redirection logic inside useEffect handles access control.
  return <>{children}</>;
}
