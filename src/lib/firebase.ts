
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, Firestore, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import type { LeadFormData, StoredLead, StoredWhatsAppLead, StoredCallLead, StoredInPersonLead } from "@/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // Used by initializeApp
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

// Check for NEXT_PUBLIC_FIREBASE_PROJECT_ID at the module scope
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error("CRITICAL Firebase Configuration Error:");
  console.error("The NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is NOT SET.");
  console.error("Your application CANNOT connect to Firebase without it.");
  console.error("Please ensure it is correctly set in your .env.local file AND you have RESTARTED your development server.");
  console.error("1. Find your Project ID in Firebase Console (Project settings).");
  console.error("2. Create or open .env.local file in your project root.");
  console.error("3. Add: NEXT_PUBLIC_FIREBASE_PROJECT_ID=\"YOUR_PROJECT_ID_HERE\"");
  console.error("4. Restart your server (e.g., `npm run dev`).");
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  // `app` and `db` remain undefined. Subsequent Firestore operations will fail gracefully
  // in their respective checks within addLeadToFirestore and getLeadsFromFirestore.
} else {
  // Project ID is set, proceed with initialization
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (initError) {
      console.error("CRITICAL Firebase App Initialization Error:", initError);
      // app remains undefined
    }
  } else {
    app = getApps()[0];
  }

  if (app) {
    try {
      db = getFirestore(app);
    } catch (firestoreError) {
      console.error("CRITICAL Firestore Initialization Error (getFirestore):", firestoreError);
      // db remains undefined
    }
  } else {
    // This case implies app initialization failed even if projectId was present.
    console.error("Firebase app is not properly initialized, cannot get Firestore instance. Check for previous initialization errors.");
  }
}

export const addLeadToFirestore = async (leadData: LeadFormData) => {
  // Check if db is initialized and projectId is present
  if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    const errorMessage = "Firebase is not configured, projectId is missing, or Firestore DB initialization failed. Cannot save lead.";
    console.error("Error in addLeadToFirestore:", errorMessage);
    return { success: false, error: errorMessage };
  }
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      createdAt: serverTimestamp(),
    });
    console.log("Lead added with ID:", docRef.id, ". Using projectId:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document to Firestore (raw): ", error);
    let errorMessage = "Failed to add document to Firestore.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = "An unknown error occurred while adding document.";
    }
    console.error("Error adding document to Firestore (processed message): ", errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const getLeadsFromFirestore = async (): Promise<StoredLead[]> => {
  // Check if db is initialized and projectId is present
  if (!db || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("CRITICAL Firebase Configuration Error in getLeadsFromFirestore:");
    console.error("Firebase is not configured, projectId is missing, or Firestore DB initialization failed. Cannot fetch leads.");
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
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

export { db }; // Export db, acknowledging it can be undefined if initialization failed.
