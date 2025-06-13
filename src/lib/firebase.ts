
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

let app: FirebaseApp;

// Enhanced check for NEXT_PUBLIC_FIREBASE_PROJECT_ID
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
}

if (!getApps().length) {
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    app = initializeApp(firebaseConfig);
  } else {
    // Mock app if projectId is missing, to prevent further crashes during init,
    // though Firebase operations will fail. The console errors above are the primary alert.
    app = { name: "mock-app", options: {}, automaticDataCollectionEnabled: false };
    console.error("Firebase app initialized with MOCK configuration due to missing Project ID. Firebase will NOT work.");
  }
} else {
  app = getApps()[0];
}

const db: Firestore = getFirestore(app);

export const addLeadToFirestore = async (leadData: LeadFormData) => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    const errorMessage = "Firebase projectId is missing. Cannot save lead.";
    console.error("Error in addLeadToFirestore:", errorMessage);
    return { success: false, error: errorMessage };
  }
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      createdAt: serverTimestamp(),
    });
    console.log("Lead added with ID:", docRef.id, ". Using projectId:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "PROJECT ID NOT SET");
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
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("CRITICAL Firebase Configuration Error in getLeadsFromFirestore:");
    console.error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is NOT SET. Cannot fetch leads.");
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    return []; // Return empty array if projectId is missing
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
        createdAt: createdAtTimestamp ? createdAtTimestamp.toDate() : new Date(), // Convert to Date object
        channelType: data.channelType, // Ensure channelType is part of the base for discrimination
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
          // Fallback or error handling if channelType is unknown
          console.warn(`Unknown channel type: ${data.channelType} for doc ID: ${doc.id}`);
          // Create a generic lead or skip if appropriate
          lead = {
            ...leadBase,
            channelType: data.channelType, // Keep original if unknown but cast
          } as StoredLead; // This might not satisfy specific StoredLead subtypes
          // To be safe, you might want to skip this record or handle it more robustly
          // For now, we'll add it but it might lack specific properties
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
