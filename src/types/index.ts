export type InterestLevel = "caliente" | "templado" | "frío";

export interface BaseLead {
  id?: string;
  interestLevel: InterestLevel;
  comment?: string;
  salonName: string;
  userName: string;
  createdAt?: Date; // Firestore will convert serverTimestamp to Date
}

export type WhatsAppSubChannel = "Meta Ads" | "Facebook Marketplace" | "Página web / Google";
export interface WhatsAppLead extends BaseLead {
  channelType: "WhatsApp";
  subChannel: WhatsAppSubChannel;
}

export type CallSource = "Google" | "Ya es cliente" | "Recomendación" | "Otro";
export interface CallLead extends BaseLead {
  channelType: "Llamada";
  source: CallSource;
  otherSourceDetail?: string;
}

export type InPersonArrivalMethod = "Paso casual" | "Medio de comunicación" | "Google" | "Recomendación";
export interface InPersonLead extends BaseLead {
  channelType: "Presencial";
  arrivalMethod: InPersonArrivalMethod;
}

export type Lead = WhatsAppLead | CallLead | InPersonLead;
