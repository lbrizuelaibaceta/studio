
import { z } from 'zod';

const interestLevels = ["caliente", "templado", "frío"] as const;
const requiredString = z.string().min(1, "Este campo es requerido.");

export const salonNames = [
  "Alameda",
  "Multiespacio",
  "San Juan",
  "San Luis",
  "San Martin",
  "San Rafael",
  "Villa Krause",
  "Villa Mercedes"
] as const;
export type SalonName = typeof salonNames[number];


const baseLeadSchema = z.object({
  interestLevel: z.enum(interestLevels, { required_error: "Seleccione un nivel de interés." }),
  comment: z.string().optional(),
  salonName: z.enum(salonNames, { required_error: "Seleccione un salón." }),
  userName: requiredString,
});

export const whatsAppLeadSchema = baseLeadSchema.extend({
  channelType: z.literal("WhatsApp"),
  subChannel: z.enum(["Meta Ads", "Facebook Marketplace", "Página web / Google"], { required_error: "Seleccione un subcanal." }),
});
export type WhatsAppFormData = z.infer<typeof whatsAppLeadSchema>;


export const callLeadSchema = baseLeadSchema.extend({
  channelType: z.literal("Llamada"),
  source: z.enum(["Google", "Ya es cliente", "Recomendación", "Otro"], { required_error: "Seleccione cómo conoció la empresa." }),
  otherSourceDetail: z.string().optional(),
}).refine(data => data.source !== "Otro" || (data.source === "Otro" && data.otherSourceDetail && data.otherSourceDetail.trim() !== ""), {
  message: "Especifique el otro medio.",
  path: ["otherSourceDetail"],
});
export type CallFormData = z.infer<typeof callLeadSchema>;


export const inPersonLeadSchema = baseLeadSchema.extend({
  channelType: z.literal("Presencial"),
  arrivalMethod: z.enum(["Paso casual", "Medio de comunicación", "Google", "Recomendación"], { required_error: "Seleccione cómo llegó al salón." }),
});
export type InPersonFormData = z.infer<typeof inPersonLeadSchema>;
