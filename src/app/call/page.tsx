
import CallForm from "@/components/forms/CallForm";
import PageHeader from "@/components/shared/PageHeader";
import BackButton from "@/components/shared/BackButton";
import { Phone } from "lucide-react";

export default function CallPage() {
  return (
    <>
      <BackButton href="/" />
      <PageHeader 
        title="Canal: Llamada"
        description="Complete los detalles de la consulta recibida por llamada telefónica."
        icon={Phone}
      />
      <CallForm />
    </>
  );
}
