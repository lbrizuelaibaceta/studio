import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-headline text-primary hover:text-primary/80 transition-colors">
          Registro de Salones
        </Link>
        <Button variant="ghost" asChild>
          <Link href="/">
            <Home className="h-5 w-5" />
            <span>Inicio</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
