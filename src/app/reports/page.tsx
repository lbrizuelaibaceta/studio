
import PageHeader from "@/components/shared/PageHeader";
import BackButton from "@/components/shared/BackButton";
import { BarChartBig } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeadsFromFirestore, type StoredLead, type StoredWhatsAppLead, type StoredCallLead, type StoredInPersonLead } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";

function LeadSpecificDetails({ lead }: { lead: StoredLead }) {
  switch (lead.channelType) {
    case "WhatsApp":
      return <TableCell>{(lead as StoredWhatsAppLead).subChannel}</TableCell>;
    case "Llamada":
      const callLead = lead as StoredCallLead;
      return <TableCell>{callLead.source} {callLead.source === 'Otro' ? `(${(callLead.otherSourceDetail || 'N/A')})` : ''}</TableCell>;
    case "Presencial":
      return <TableCell>{(lead as StoredInPersonLead).arrivalMethod}</TableCell>;
    default:
      //This should not happen if types are correct
      const _exhaustiveCheck: never = lead;
      return <TableCell>N/A</TableCell>;
  }
}

export default async function ReportsPage() {
  const leads = await getLeadsFromFirestore();

  return (
    <>
      <BackButton href="/" />
      <div className="flex flex-col items-center">
        <PageHeader
          title="Reportes de Consultas"
          description="Visualice los datos y estadísticas de las consultas registradas."
          icon={BarChartBig}
        />
        <Card className="w-full mt-6">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Consultas Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aún no se han registrado consultas.
              </p>
            ) : (
              <Table>
                <TableCaption>Una lista de las consultas recientes.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Fecha</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Salón</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Detalle Canal</TableHead>
                    <TableHead>Nivel Interés</TableHead>
                    <TableHead>Comentario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>{lead.createdAt}</TableCell>
                      <TableCell>{lead.userName}</TableCell>
                      <TableCell>{lead.salonName}</TableCell>
                      <TableCell>{lead.channelType}</TableCell>
                      <LeadSpecificDetails lead={lead} />
                      <TableCell>{lead.interestLevel}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{lead.comment || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
