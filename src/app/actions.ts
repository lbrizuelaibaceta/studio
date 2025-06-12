"use server";

import { addLeadToFirestore } from "@/lib/firebase";
import type { WhatsAppLead, CallLead, InPersonLead, Lead } from "@/types";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function saveLeadAction(leadData: Omit<Lead, 'id' | 'createdAt'>): Promise<ActionResult> {
  try {
    const result = await addLeadToFirestore(leadData);
    if (result.success) {
      // Optionally revalidate paths if reports or lists are displayed
      // revalidatePath('/');
      // revalidatePath('/reports');
      return { success: true, message: "Consulta registrada exitosamente." };
    } else {
      return { success: false, message: "Error al registrar la consulta.", error: result.error };
    }
  } catch (error) {
    console.error("Error in saveLeadAction: ", error);
    return { success: false, message: "Error interno del servidor.", error: (error as Error).message };
  }
}
