import { Timestamp } from 'firebase/firestore';

export type Sender = 'user' | 'agent';

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Timestamp;
  userAvatar?: string | null;
  // Fix: Add displayName to the Message interface to resolve type error in MessageComponent.
  displayName?: string | null;
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isGuest: boolean;
}
