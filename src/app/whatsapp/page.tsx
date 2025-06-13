
import WhatsAppForm from "@/components/forms/WhatsAppForm";
import PageHeader from "@/components/shared/PageHeader";
import BackButton from "@/components/shared/BackButton";
import { MessageSquare } from "lucide-react";

export default function WhatsAppPage() {
  return (
    <>
      <BackButton href="/new-query" />
      <PageHeader 
        title="Canal: WhatsApp"
        description="Complete los detalles de la consulta recibida por WhatsApp."
        icon={MessageSquare}
      />
      <WhatsAppForm />
    </>
  );
}
