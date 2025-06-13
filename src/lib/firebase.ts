
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Firestore, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import type { LeadFormData, StoredLead } from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db: Firestore = getFirestore(app);

export const addLeadToFirestore = async (leadData: LeadFormData) => {
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    let errorMessage = "Failed to add document to Firestore.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = "An unknown error occurred while adding document.";
    }
    return { success: false, error: errorMessage };
  }
};

export const getLeadsFromFirestore = async (): Promise<StoredLead[]> => {
  try {
    const leadsCollection = collection(db, "leads");
    const q = query(leadsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const leads: StoredLead[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAtTimestamp = data.createdAt as Timestamp; // Firestore Timestamp

      const lead = {
        id: doc.id,
        channelType: data.channelType,
        interestLevel: data.interestLevel,
        comment: data.comment,
        salonName: data.salonName,
        userName: data.userName,
        createdAt: createdAtTimestamp ? createdAtTimestamp.toDate().toLocaleString() : 'N/A',
      } as StoredLead; // Base part

      // Add channel-specific fields
      if (data.channelType === "WhatsApp") {
        (lead as StoredWhatsAppLead).subChannel = data.subChannel;
      } else if (data.channelType === "Llamada") {
        (lead as StoredCallLead).source = data.source;
        if (data.source === "Otro") {
          (lead as StoredCallLead).otherSourceDetail = data.otherSourceDetail;
        }
      } else if (data.channelType === "Presencial") {
        (lead as StoredInPersonLead).arrivalMethod = data.arrivalMethod;
      }
      
      leads.push(lead);
    });
    return leads;
  } catch (error) {
    console.error("Error getting documents from Firestore: ", error);
    return [];
  }
};

export { db };
