
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
          <Image
            src="https://www.rribaceta.com.ar/equipamiento-comercial/img/logo-17237281228.jpg"
            alt="Ibaceta Logo"
            width={150}
            height={40}
            priority
          />
        </Link>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="h-5 w-5" />
            <span>Panel</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
