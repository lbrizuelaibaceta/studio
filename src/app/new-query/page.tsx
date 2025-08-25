
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Phone } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function NewQueryPage() {
  const channels = [
    { name: 'WhatsApp', href: '/whatsapp', icon: MessageSquare, description: 'Registrar consulta por WhatsApp' },
    { name: 'Llamada', href: '/call', icon: Phone, description: 'Registrar consulta por llamada telefónica' },
  ];

  return (
    <>
      {/* No back button here, as this is the new root for vendors */}
      <div className="flex flex-col items-center justify-center">
        <PageHeader 
          title="Registrar Nueva Consulta"
          description="Seleccione el canal por el cual se recibió la consulta."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
          {channels.map((channel) => (
            <Card key={channel.name} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="items-center">
                <channel.icon className="w-12 h-12 text-primary mb-2" />
                <CardTitle className="font-headline text-2xl text-center">{channel.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <p className="text-muted-foreground text-center mb-4 h-12">{channel.description}</p>
                <Button asChild className="w-full">
                  <Link href={channel.href}>Seleccionar</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
