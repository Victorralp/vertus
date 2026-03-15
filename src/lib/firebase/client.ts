/**
 * Firebase Client SDK Configuration
 * 
 * This file initializes the Firebase client SDK for use in the browser.
 * It configures Firebase Auth, Firestore, and connects to emulators in development.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app (singleton pattern)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
const functionsRegion = process.env.NEXT_PUBLIC_FUNCTIONS_REGION || 'us-central1';
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const functions: Functions = getFunctions(app, functionsRegion);

// Connect to Firebase emulators in development
const shouldUseEmulator =
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

if (shouldUseEmulator) {
  const authEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
  const firestoreEmulatorHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;
  const functionsEmulatorHost = process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST;

  // Connect Auth emulator
  if (authEmulatorHost && !(auth as any)._canInitEmulator) {
    const [host, port] = authEmulatorHost.split(':');
    connectAuthEmulator(auth, `http://${host}:${port}`, { disableWarnings: true });
  }

  // Connect Firestore emulator
  if (firestoreEmulatorHost && !(db as any)._settingsFrozen) {
    const [host, port] = firestoreEmulatorHost.split(':');
    connectFirestoreEmulator(db, host, parseInt(port));
  }

  // Connect Functions emulator
  if (functionsEmulatorHost && !(functions as any)._customDomain) {
    const [host, port] = functionsEmulatorHost.split(':');
    connectFunctionsEmulator(functions, host, parseInt(port));
  }

  console.log('🔧 Firebase emulators connected');
}

// Export Firebase services
export { app, auth, db, functions };

// Export Firebase types for convenience
export type { User } from 'firebase/auth';
export type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
