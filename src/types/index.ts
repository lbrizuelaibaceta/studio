
export type InterestLevel = "caliente" | "templado" | "frío";

export interface BaseLead {
  // id is managed by Firestore and added upon retrieval
  interestLevel: InterestLevel;
  comment?: string;
  salonName: string;
  userName:string;
  // createdAt is managed by Firestore serverTimestamp and converted upon retrieval
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

// Union type for form data submission (without id and createdAt)
export type LeadFormData = WhatsAppLead | CallLead | InPersonLead;

// Base for stored leads, including id and a string/Date representation of createdAt
interface StoredLeadBase extends BaseLead {
  id: string;
  createdAt: string; // Or Date, depending on how you want to handle it post-retrieval
}

// Specific stored lead types
export type StoredWhatsAppLead = WhatsAppLead & StoredLeadBase;
export type StoredCallLead = CallLead & StoredLeadBase;
export type StoredInPersonLead = InPersonLead & StoredLeadBase;

export type StoredLead = StoredWhatsAppLead | StoredCallLead | StoredInPersonLead;

// The Lead type for general usage, often representing data from Firestore
export type Lead = BaseLead & {
  id?: string;
  createdAt?: Date | string; // Firestore Timestamp will be Date or string after conversion
  channelType: "WhatsApp" | "Llamada" | "Presencial";
  // Include specific fields from subtypes for easier access if needed, or use discriminated union
  subChannel?: WhatsAppSubChannel;
  source?: CallSource;
  otherSourceDetail?: string;
  arrivalMethod?: InPersonArrivalMethod;
};
