import { getFirebaseAuth } from '../auth/firebase';

let emulatorConnected = false;

export function getFirestoreDb(): any {
  const firebase = window.firebase;
  if (!firebase?.firestore) {
    throw new Error('AFTER HOURS multiplayer storage is not loaded. Refresh and try again.');
  }
  const app = firebase.apps?.length ? firebase.app() : getFirebaseAuth().app;
  const db = app.firestore();
  const emulatorHost = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST;
  if (emulatorHost && !emulatorConnected) {
    const [host, portText] = emulatorHost.split(':');
    db.useEmulator(host, Number(portText || 8080));
    emulatorConnected = true;
  }
  return db;
}

export const serverTimestamp = () => window.firebase.firestore.FieldValue.serverTimestamp();
