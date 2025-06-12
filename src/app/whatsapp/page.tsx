import WhatsAppForm from "@/components/forms/WhatsAppForm";
import PageHeader from "@/components/shared/PageHeader";
import { MessageSquare } from "lucide-react";

export default function WhatsAppPage() {
  return (
    <>
      <PageHeader 
        title="Canal: WhatsApp"
        description="Complete los detalles de la consulta recibida por WhatsApp."
        icon={MessageSquare}
      />
      <WhatsAppForm />
    </>
  );
}
