
import { useContext } from 'react';
import {
// Fix: Changed firebase/auth to @firebase/auth to resolve module loading issue.
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { User } from '../types';
import { GUEST_ACCESS_CODE } from '../constants';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      sessionStorage.removeItem('guestUser');
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  const loginAsGuest = (username: string, accessCode: string) => {
    if (accessCode.toUpperCase() === GUEST_ACCESS_CODE) {
        const guestUser: User = {
            uid: `guest_${Date.now()}`,
            displayName: username,
            email: null,
            photoURL: null,
            isGuest: true,
        };
        sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
        // This will trigger a state update in the provider, but we force a reload to ensure context is updated
        window.location.reload();
        return true;
    }
    return false;
  }

  const logout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('guestUser');
      window.location.reload(); // Ensure clean state on logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { ...context, loginWithGoogle, loginAsGuest, logout };
};
