
"use client";

import * as React from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, BarChartBig, XCircle, FileDown } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import BackButton from "@/components/shared/BackButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeadsFromFirestore, type StoredLead, type StoredWhatsAppLead, type StoredCallLead } from "@/lib/firebase";
import { salonNames } from "@/components/forms/LeadFormSchema";
import type { InterestLevel, ChannelType } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ALL_FILTER_SENTINEL = "__ALL__"; // Sentinel for "All" options

function LeadSpecificDetails({ lead }: { lead: StoredLead }) {
  switch (lead.channelType) {
    case "WhatsApp":
      return <TableCell>{(lead as StoredWhatsAppLead).subChannel}</TableCell>;
    case "Llamada":
      const callLead = lead as StoredCallLead;
      return <TableCell>{callLead.source} {callLead.source === 'Otro' ? `(${(callLead.otherSourceDetail || 'N/A')})` : ''}</TableCell>;
    default:
      return <TableCell>N/A</TableCell>;
  }
}

const channelOptions: { value: ChannelType | typeof ALL_FILTER_SENTINEL; label: string }[] = [
  { value: ALL_FILTER_SENTINEL, label: "Todos los Canales" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Llamada", label: "Llamada" },
];

const interestLevelOptions: { value: InterestLevel | typeof ALL_FILTER_SENTINEL; label: string }[] = [
  { value: ALL_FILTER_SENTINEL, label: "Todos los Estados" },
  { value: "caliente", label: "Muy interesado" },
  { value: "templado", label: "Interesado" },
  { value: "frío", label: "Desinteresado" },
  { value: "erroneo", label: "Erroneo/Equivocado" },
];

const salonOptionsList = [
  { value: ALL_FILTER_SENTINEL, label: "Todos los Salones" },
  ...salonNames.map(name => ({ value: name, label: name }))
];


export default function ReportsPage() {
  const [allLeads, setAllLeads] = React.useState<StoredLead[]>([]);
  const [filteredLeads, setFilteredLeads] = React.useState<StoredLead[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [dateFilter, setDateFilter] = React.useState<Date | undefined>(undefined);
  const [salonFilter, setSalonFilter] = React.useState<string>(""); // Empty string means no filter
  const [channelFilter, setChannelFilter] = React.useState<string>("");
  const [interestFilter, setInterestFilter] = React.useState<string>("");

  React.useEffect(() => {
    async function fetchLeads() {
      setIsLoading(true);
      const leadsData = await getLeadsFromFirestore();
      setAllLeads(leadsData);
      setFilteredLeads(leadsData);
      setIsLoading(false);
    }
    fetchLeads();
  }, []);

  React.useEffect(() => {
    let leads = [...allLeads];

    if (dateFilter) {
      leads = leads.filter(lead => lead.createdAt && isSameDay(lead.createdAt, dateFilter));
    }
    if (salonFilter) {
      leads = leads.filter(lead => lead.salonName === salonFilter);
    }
    if (channelFilter) {
      leads = leads.filter(lead => lead.channelType === channelFilter);
    }
    if (interestFilter) {
      leads = leads.filter(lead => lead.interestLevel === interestFilter);
    }
    setFilteredLeads(leads);
  }, [dateFilter, salonFilter, channelFilter, interestFilter, allLeads]);

  const clearFilters = () => {
    setDateFilter(undefined);
    setSalonFilter("");
    setChannelFilter("");
    setInterestFilter("");
  };
  
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Seleccione una fecha";
    return format(date, "PPP", { locale: es });
  };

  const handleExportCSV = () => {
    if (!filteredLeads.length) return;

    // Define CSV headers
    const headers = [
      "Fecha",
      "Vendedor",
      "Salon",
      "Canal",
      "Detalle Canal",
      "Nivel Interes",
      "Comentario",
    ];

    const escapeCSV = (str: string | undefined | null) => {
        if (str === undefined || str === null) return '';
        const res = String(str);
        // If the string contains a comma, double quote, or newline, wrap it in double quotes
        if (res.includes(',') || res.includes('"') || res.includes('\n')) {
            // Escape any existing double quotes by doubling them
            return `"${res.replace(/"/g, '""')}"`;
        }
        return res;
    };


    // Map data to CSV rows
    const rows = filteredLeads.map(lead => {
      let channelDetail = "";
      if (lead.channelType === "WhatsApp") {
        channelDetail = (lead as StoredWhatsAppLead).subChannel;
      } else if (lead.channelType === "Llamada") {
        const callLead = lead as StoredCallLead;
        channelDetail = callLead.source || "";
        if (callLead.source === "Otro") {
            channelDetail += ` (${callLead.otherSourceDetail || 'N/A'})`;
        }
      }

      return [
        escapeCSV(lead.createdAt ? format(lead.createdAt, "dd/MM/yyyy HH:mm", { locale: es }) : 'N/A'),
        escapeCSV(lead.userName),
        escapeCSV(lead.salonName),
        escapeCSV(lead.channelType),
        escapeCSV(channelDetail),
        escapeCSV(lead.interestLevel),
        escapeCSV(lead.comment),
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Create a Blob and trigger download
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'reporte_consultas.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <BackButton href="/dashboard" />
      <div className="flex flex-col items-center">
        <PageHeader
          title="Reportes de Consultas"
          description="Visualice y filtre las consultas registradas."
          icon={BarChartBig}
        />
        <Card className="w-full mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Filtros de Consulta</CardTitle>
            <CardDescription>Use los filtros para refinar su búsqueda de consultas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Date Filter */}
              <div className="space-y-1">
                <label htmlFor="date-filter" className="text-sm font-medium">Fecha</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-filter"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(dateFilter)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Salon Filter */}
              <div className="space-y-1">
                <label htmlFor="salon-filter" className="text-sm font-medium">Salón</label>
                <Select
                  value={salonFilter || ALL_FILTER_SENTINEL}
                  onValueChange={(value) => setSalonFilter(value === ALL_FILTER_SENTINEL ? "" : value)}
                >
                  <SelectTrigger id="salon-filter">
                    <SelectValue placeholder="Todos los Salones" />
                  </SelectTrigger>
                  <SelectContent>
                    {salonOptionsList.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Channel Filter */}
              <div className="space-y-1">
                <label htmlFor="channel-filter" className="text-sm font-medium">Canal</label>
                <Select
                  value={channelFilter || ALL_FILTER_SENTINEL}
                  onValueChange={(value) => setChannelFilter(value === ALL_FILTER_SENTINEL ? "" : value)}
                >
                  <SelectTrigger id="channel-filter">
                    <SelectValue placeholder="Todos los Canales" />
                  </SelectTrigger>
                  <SelectContent>
                    {channelOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Interest Level Filter */}
              <div className="space-y-1">
                <label htmlFor="interest-filter" className="text-sm font-medium">Estado del Lead</label>
                 <Select
                  value={interestFilter || ALL_FILTER_SENTINEL}
                  onValueChange={(value) => setInterestFilter(value === ALL_FILTER_SENTINEL ? "" : value)}
                >
                  <SelectTrigger id="interest-filter">
                    <SelectValue placeholder="Todos los Estados" />
                  </SelectTrigger>
                  <SelectContent>
                    {interestLevelOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
             <Button onClick={clearFilters} variant="ghost" className="w-full md:w-auto mt-4">
                <XCircle className="mr-2 h-4 w-4" />
                Limpiar Filtros
              </Button>
          </CardContent>
        </Card>

        <Card className="w-full mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Consultas Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Cargando consultas...</p>
            ) : filteredLeads.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No se encontraron consultas con los filtros aplicados.
              </p>
            ) : (
              <Table>
                <TableCaption>
                  Mostrando {filteredLeads.length} de {allLeads.length} consultas.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Fecha</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Salón</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Detalle Canal</TableHead>
                    <TableHead>Nivel Interés</TableHead>
                    <TableHead className="min-w-[200px]">Comentario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>{lead.createdAt ? format(lead.createdAt, "dd/MM/yyyy HH:mm", { locale: es }) : 'N/A'}</TableCell>
                      <TableCell>{lead.userName}</TableCell>
                      <TableCell>{lead.salonName}</TableCell>
                      <TableCell>{lead.channelType}</TableCell>
                      <LeadSpecificDetails lead={lead} />
                      <TableCell>{lead.interestLevel}</TableCell>
                      <TableCell className="max-w-[250px] truncate hover:whitespace-normal hover:overflow-visible">{lead.comment || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
           <CardFooter className="flex justify-between items-center pt-4">
            <p className="text-sm text-muted-foreground font-semibold">
              Total de registros mostrados: {filteredLeads.length}
            </p>
             <Button 
                onClick={handleExportCSV}
                disabled={filteredLeads.length === 0 || isLoading}
             >
                <FileDown className="mr-2 h-4 w-4" />
                Exportar a CSV
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

    