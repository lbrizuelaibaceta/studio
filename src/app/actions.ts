
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
    const result = await addLeadToFirestore(leadData);
    if (result.success) {
      revalidatePath('/reports'); 
      revalidatePath('/');
      return { success: true, message: "Consulta registrada exitosamente." };
    } else {
      return { success: false, message: "Error al registrar la consulta.", error: result.error };
    }
  } catch (error) {
    console.error("Error in saveLeadAction (raw): ", error); 
    let errorMessage = "Error interno del servidor procesando la solicitud.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object' && error !== null && 'toString' in error) {
      errorMessage = error.toString();
    }
    console.error("Error in saveLeadAction (processed message): ", errorMessage);
    return { success: false, message: "Error interno del servidor.", error: errorMessage };
  }
}
