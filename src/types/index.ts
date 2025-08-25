
export type InterestLevel = "caliente" | "templado" | "frío" | "erroneo";
export type ChannelType = "WhatsApp" | "Llamada";

export interface BaseLead {
  interestLevel: InterestLevel;
  comment: string;
  salonName: string;
  userName:string;
}

export type WhatsAppSubChannel = "Meta Ads" | "No identificado";
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

export type LeadFormData = WhatsAppLead | CallLead;

interface StoredLeadBase extends BaseLead {
  id: string;
  createdAt: Date; 
  channelType: ChannelType; 
}

export type StoredWhatsAppLead = WhatsAppLead & StoredLeadBase;
export type StoredCallLead = CallLead & StoredLeadBase;

export type StoredLead = StoredWhatsAppLead | StoredCallLead;

export type Lead = BaseLead & {
  id?: string;
  createdAt?: Date; 
  channelType: ChannelType;
  subChannel?: WhatsAppSubChannel;
  source?: CallSource;
  otherSourceDetail?: string;
};
