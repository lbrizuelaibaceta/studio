import CallForm from "@/components/forms/CallForm";
import PageHeader from "@/components/shared/PageHeader";
import { Phone } from "lucide-react";

export default function CallPage() {
  return (
    <>
      <PageHeader 
        title="Canal: Llamada"
        description="Complete los detalles de la consulta recibida por llamada telefónica."
        icon={Phone}
      />
      <CallForm />
    </>
  );
}
