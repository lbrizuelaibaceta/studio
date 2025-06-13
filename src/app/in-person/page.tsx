
import InPersonForm from "@/components/forms/InPersonForm";
import PageHeader from "@/components/shared/PageHeader";
import BackButton from "@/components/shared/BackButton";
import { Users } from "lucide-react";

export default function InPersonPage() {
  return (
    <>
      <BackButton href="/new-query" />
      <PageHeader 
        title="Canal: Presencial"
        description="Complete los detalles de la consulta de visita física en el local."
        icon={Users}
      />
      <InPersonForm />
    </>
  );
}
