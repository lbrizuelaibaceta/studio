
"use server";

import { addLeadToFirestore } from "@/lib/firebase";
import type { LeadFormData } from "@/types";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function saveLeadAction(leadData: LeadFormData): Promise<ActionResult> {
  try {
    // Ensure that userName and salonName are not empty, as they are now auto-filled
    if (!leadData.userName || !leadData.salonName) {
      return { success: false, message: "Error: Faltan datos del vendedor o del salón. Por favor, inicie sesión de nuevo." };
    }

    const result = await addLeadToFirestore(leadData);
    if (result.success) {
      // Revalidate both the reports page and the new query page (or the dashboard for admins)
      revalidatePath('/reports'); 
      revalidatePath('/new-query');
      revalidatePath('/dashboard');
      revalidatePath('/');
      return { success: true, message: "Consulta registrada exitosamente." };
    } else {
      // Pass the specific error message from the Firestore function
      return { success: false, message: result.error || "Error desconocido al registrar la consulta." };
    }
  } catch (error: any) {
    console.error("Error in saveLeadAction: ", error); 
    const errorMessage = error.message || "Error interno del servidor procesando la solicitud.";
    return { success: false, message: "Error interno del servidor.", error: errorMessage };
  }
}
