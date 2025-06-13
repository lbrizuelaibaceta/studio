
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus2, BarChartBig } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function LandingPage() {
  const sections = [
    {
      name: 'Registrar una nueva consulta',
      href: '/new-query',
      icon: FilePlus2,
      description: 'Inicia el proceso para ingresar los detalles de una nueva consulta de cliente.',
    },
    {
      name: 'Ver Registros',
      href: '/reports',
      icon: BarChartBig,
      description: 'Accede a los reportes y estadísticas de las consultas registradas.',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <PageHeader
        title="Bienvenido a Salon Insights"
        description="Seleccione una acción para continuar."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mt-8">
        {sections.map((section) => (
          <Card key={section.name} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <CardHeader className="items-center">
              <section.icon className="w-16 h-16 text-primary mb-3" />
              <CardTitle className="font-headline text-3xl text-center">{section.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center flex-grow">
              <p className="text-muted-foreground text-center mb-6 h-16">{section.description}</p>
              <Button asChild className="w-full mt-auto">
                <Link href={section.href}>Acceder</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
