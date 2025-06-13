
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Firestore, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import type { LeadFormData, StoredLead, StoredWhatsAppLead, StoredCallLead, StoredInPersonLead } from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!projectId) {
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error("CRITICAL Firebase Configuration Error:");
  console.error("The NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is NOT SET.");
  console.error("Your application CANNOT connect to Firebase without it.");
  console.error("--- Cómo Solucionarlo ---");
  console.error("1. Encuentra tu 'ID del Proyecto' en la consola de Firebase (firebase.google.com) -> Configuración del proyecto.");
  console.error("2. Crea un archivo llamado '.env.local' en la CARPETA PRINCIPAL de tu proyecto (al mismo nivel que 'package.json').");
  console.error("3. Dentro de '.env.local', añade la línea: NEXT_PUBLIC_FIREBASE_PROJECT_ID=\"TU_ID_DE_PROYECTO_AQUI\" (reemplaza con tu ID real).");
  console.error("4. Asegúrate de que las otras variables NEXT_PUBLIC_FIREBASE_... también estén en '.env.local'.");
  console.error("5. ¡MUY IMPORTANTE! DETÉN tu servidor de desarrollo (Ctrl+C en la terminal) y VUELVE A INICIARLO (ej. 'npm run dev').");
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
} else {
  if (!getApps().length) {
    try {
      console.log(`Attempting to initialize Firebase with projectId: ${projectId}`);
      app = initializeApp(firebaseConfig);
      console.log("Firebase app initialized successfully.");
    } catch (initError) {
      console.error("CRITICAL Firebase App Initialization Error:", initError);
      app = undefined; // Ensure app is undefined if init fails
    }
  } else {
    app = getApps()[0];
    console.log("Firebase app already initialized.");
  }

  if (app) {
    try {
      db = getFirestore(app);
      console.log("Firestore DB instance obtained successfully.");
    } catch (firestoreError) {
      console.error("CRITICAL Firestore Initialization Error (getFirestore):", firestoreError);
      db = undefined; // Ensure db is undefined if getFirestore fails
    }
  } else {
    console.error("Firebase app is not initialized, cannot get Firestore instance.");
    db = undefined;
  }
}

export const addLeadToFirestore = async (leadData: LeadFormData) => {
  if (!db) {
    const errorMessage = "Error al guardar: Firebase no está configurado correctamente. Falta el ID del Proyecto. Por favor, revisa el archivo '.env.local', asegúrate de que NEXT_PUBLIC_FIREBASE_PROJECT_ID esté bien puesto, y REINICIA el servidor de desarrollo.";
    console.error("Error in addLeadToFirestore:", errorMessage);
    return { success: false, error: errorMessage };
  }
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      createdAt: serverTimestamp(),
    });
    console.log("Lead added with ID:", docRef.id, ". Using projectId:", projectId);
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
  if (!db) {
    const errorMessage = "Error al obtener registros: Firebase no está configurado correctamente. Falta el ID del Proyecto. Revisa '.env.local' y REINICIA el servidor.";
    console.error("Error in getLeadsFromFirestore:", errorMessage);
    return [];
  }
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
        case "Presencial":
          lead = {
            ...leadBase,
            channelType: "Presencial",
            arrivalMethod: data.arrivalMethod,
          } as StoredInPersonLead;
          break;
        default:
          console.warn(`Unknown channel type: ${data.channelType} for doc ID: ${doc.id}`);
          lead = {
            ...leadBase,
            channelType: data.channelType,
          } as StoredLead;
      }
      leads.push(lead);
    });
    return leads;
  } catch (error) {
    console.error("[ Server ] Error in getLeadsFromFirestore:", error);
    return [];
  }
};

export { db };
