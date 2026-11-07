const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDutkbB8EyNQZOAuhGEQD_R4QeYc8YFvaY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'after-hours-3fba0.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'after-hours-3fba0',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'after-hours-3fba0.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1009184122718',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1009184122718:web:954c8a559b3ff25f4051cf',
};

let authInstance: any;

export function getFirebaseAuth(): any {
  if (authInstance) return authInstance;
  if (!window.firebase) {
    throw new Error('Firebase could not load. Check your connection and refresh AFTER HOURS.');
  }
  const app = window.firebase.apps?.length
    ? window.firebase.app()
    : window.firebase.initializeApp(firebaseConfig);
  authInstance = app.auth();
  const emulatorHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST;
  if (emulatorHost && !authInstance.emulatorConfig) {
    const [host, portText] = emulatorHost.split(':');
    authInstance.useEmulator(`http://${host}:${Number(portText || 9099)}`);
  }
  return authInstance;
}

export async function getFirebaseIdToken(): Promise<string> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error('Please sign in again to continue.');
  return user.getIdToken();
}
