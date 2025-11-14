export const FIREBASE_CONFIG = {
  // @ts-ignore
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  // @ts-ignore
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  // @ts-ignore
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  // @ts-ignore
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  // @ts-ignore
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  // @ts-ignore
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

export const BACKEND_URL = "https://potential-octo-backend-production.up.railway.app";

export const AGENT_AVATAR_URL = "https://iili.io/K82KYWN.jpg";

export const GUEST_ACCESS_CODE = "SHADOW"; // Simple hardcoded access code for guest login

export const MAX_MESSAGES_PER_DAY = 5;