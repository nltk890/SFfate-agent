import React, { createContext, useState, useEffect, ReactNode } from 'react';
// Fix: Changed firebase/auth to @firebase/auth to resolve module loading issue.
import { onAuthStateChanged, User as FirebaseUser } from '@firebase/auth';
import { auth } from '../firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          isGuest: firebaseUser.isAnonymous, // Firebase anonymous auth can be used for guests
        });
      } else {
        // Check session storage for guest user
        const guestUserJson = sessionStorage.getItem('guestUser');
        if (guestUserJson) {
            setUser(JSON.parse(guestUserJson));
        } else {
            setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};