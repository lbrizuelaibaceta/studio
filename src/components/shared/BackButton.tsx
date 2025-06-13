
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  href: string;
  className?: string;
}

export default function BackButton({ href, className }: BackButtonProps) {
  return (
    <div className={cn("mb-6 flex justify-start", className)}>
      <Button variant="outline" asChild>
        <Link href={href}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>
      </Button>
    </div>
  );
}
