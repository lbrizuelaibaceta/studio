import PageHeader from "@/components/shared/PageHeader";
import { BarChartBig } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="flex flex-col items-center">
      <PageHeader 
        title="Reportes de Consultas"
        description="Visualice los datos y estadísticas de las consultas registradas."
        icon={BarChartBig}
      />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center font-headline">Próximamente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            La funcionalidad de reportes está en desarrollo y estará disponible pronto.
            Aquí podrá ver resúmenes diarios por salón, fuentes de leads, niveles de interés y más detalles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
