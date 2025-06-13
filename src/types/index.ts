
export type InterestLevel = "caliente" | "templado" | "frío";
export type ChannelType = "WhatsApp" | "Llamada" | "Presencial";

export interface BaseLead {
  interestLevel: InterestLevel;
  comment?: string;
  salonName: string;
  userName:string;
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

export type LeadFormData = WhatsAppLead | CallLead | InPersonLead;

interface StoredLeadBase extends BaseLead {
  id: string;
  createdAt: Date; // Changed to Date
  channelType: ChannelType; // Added channelType here for easier access
}

export type StoredWhatsAppLead = WhatsAppLead & StoredLeadBase;
export type StoredCallLead = CallLead & StoredLeadBase;
export type StoredInPersonLead = InPersonLead & StoredLeadBase;

export type StoredLead = StoredWhatsAppLead | StoredCallLead | StoredInPersonLead;

export type Lead = BaseLead & {
  id?: string;
  createdAt?: Date; // Changed to Date
  channelType: ChannelType;
  subChannel?: WhatsAppSubChannel;
  source?: CallSource;
  otherSourceDetail?: string;
  arrivalMethod?: InPersonArrivalMethod;
};
