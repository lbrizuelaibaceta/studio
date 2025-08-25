
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Firestore, getDocs, query, orderBy, Timestamp, setDoc, doc } from "firebase/firestore";
import type { LeadFormData, StoredLead, StoredWhatsAppLead, StoredCallLead } from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    throw new Error("CRITICAL: NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined in .env.local");
  }
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
    console.log("Lead added with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document to Firestore (raw): ", error);
    let errorMessage = "Error al registrar la consulta en la base de datos.";
    if (error instanceof Error) {
      errorMessage = `${errorMessage} Detalles: ${error.message}`;
    }
    console.error("Error adding document to Firestore (processed message): ", errorMessage);
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
      const createdAtTimestamp = data.createdAt as Timestamp;

      const leadBase = {
        id: doc.id,
        interestLevel: data.interestLevel,
        comment: data.comment,
        salonName: data.salonName,
        userName: data.userName,
        createdAt: createdAtTimestamp ? createdAtTimestamp.toDate() : new Date(),
        channelType: data.channelType,
      };

      let lead: StoredLead;

      switch (data.channelType) {
        case "WhatsApp":
          lead = {
            ...leadBase,
            channelType: "WhatsApp",
            subChannel: data.subChannel,
          } as StoredWhatsAppLead;
          break;
        case "Llamada":
          lead = {
            ...leadBase,
            channelType: "Llamada",
            source: data.source,
            otherSourceDetail: data.otherSourceDetail,
          } as StoredCallLead;
          break;
        default:
          console.warn(`Unknown or removed channel type: ${data.channelType} for doc ID: ${doc.id}`);
          // Skip unknown types
          return;
      }
      leads.push(lead);
    });
    return leads;
  } catch (error) {
    console.error("[ Server ] Error in getLeadsFromFirestore:", error);
    return [];
  }
};

// Export app and db for use in other parts of the application, like AuthContext.
export { app, db };
