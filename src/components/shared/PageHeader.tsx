import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export default function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        {Icon && <Icon className="h-8 w-8 text-primary" />}
        <h1 className="text-3xl md:text-4xl font-headline text-primary">{title}</h1>
      </div>
      {description && <p className="text-lg text-muted-foreground">{description}</p>}
    </div>
  );
}
