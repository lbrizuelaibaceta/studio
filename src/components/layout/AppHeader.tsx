"use client";

import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={user ? "/dashboard" : "/login"} className="hover:opacity-80 transition-opacity">
          <Image
            src="https://www.rribaceta.com.ar/equipamiento-comercial/img/logo-17237281228.jpg"
            alt="Ibaceta Logo"
            width={150}
            height={40}
            priority
          />
        </Link>
        {user && (
           <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="h-5 w-5" />
                <span>Panel</span>
              </Link>
            </Button>
             <Button variant="outline" onClick={handleLogout} size="sm">
               <LogOut className="mr-2 h-4 w-4" />
               Cerrar Sesión
             </Button>
           </div>
        )}
      </div>
    </header>
  );
}
