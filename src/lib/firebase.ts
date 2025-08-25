
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Firestore, getDocs, query, orderBy, Timestamp, setDoc, doc } from "firebase/firestore";
import type { LeadFormData, StoredLead, StoredWhatsAppLead, StoredCallLead } from "@/types";

// ATENCIÓN: ¡Reemplaza estos valores con tus credenciales reales de Firebase!
// Puedes encontrarlos en la configuración de tu proyecto en la consola de Firebase.
const firebaseConfig = {
  apiKey: "TU_API_KEY_VA_AQUI",
  authDomain: "TU_AUTH_DOMAIN_VA_AQUI",
  projectId: "TU_PROJECT_ID_VA_AQUI",
  storageBucket: "TU_STORAGE_BUCKET_VA_AQUI",
  messagingSenderId: "TU_MESSAGING_SENDER_ID_VA_AQUI",
  appId: "TU_APP_ID_VA_AQUI",
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  // Check if any of the placeholder values are still there.
  if (Object.values(firebaseConfig).some(value => value.startsWith("TU_"))) {
     console.error("CRITICAL: Firebase config is not set. Please update src/lib/firebase.ts with your project credentials.");
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
