
import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Message, User } from '../types';
import { MAX_MESSAGES_PER_DAY } from '../constants';

export const useFirestore = (user: User | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [isRateLimited, setRateLimited] = useState(false);

  const checkRateLimit = useCallback(async () => {
    if (!user || user.isGuest) {
        setRateLimited(false);
        setMessageCount(0);
        return;
    };

    const rateLimitRef = doc(db, 'rateLimits', user.uid);
    const docSnap = await getDoc(rateLimitRef);
    const today = new Date().toDateString();

    if (docSnap.exists()) {
      const data = docSnap.data();
      const lastMessageDate = (data.lastMessageDate as Timestamp).toDate().toDateString();
      
      if (lastMessageDate === today) {
        const count = data.count || 0;
        setMessageCount(count);
        if (count >= MAX_MESSAGES_PER_DAY) {
          setRateLimited(true);
        } else {
          setRateLimited(false);
        }
      } else {
        // Reset for a new day
        await setDoc(rateLimitRef, { count: 0, lastMessageDate: Timestamp.now() });
        setMessageCount(0);
        setRateLimited(false);
      }
    } else {
      // No record, so user is not limited
      setMessageCount(0);
      setRateLimited(false);
    }
  }, [user]);
  
  useEffect(() => {
    checkRateLimit();
  }, [checkRateLimit]);

  useEffect(() => {
    if (!user || user.isGuest) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const messagesCol = collection(db, 'chats', user.uid, 'messages');
    const q = query(messagesCol, orderBy('timestamp', 'asc'));

    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(fetchedMessages);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addMessage = async (message: Omit<Message, 'id'>) => {
    if (!user || user.isGuest) {
        // For guest users, just update local state
        setMessages(prev => [...prev, {...message, id: Date.now().toString()}]);
        return;
    }

    if (isRateLimited && message.sender === 'user') {
        console.log("Message blocked due to rate limit.");
        return;
    }
    
    // Add to firestore
    await addDoc(collection(db, 'chats', user.uid, 'messages'), message);
    
    // Update rate limit only for agent responses
    if (message.sender === 'agent') {
        const rateLimitRef = doc(db, 'rateLimits', user.uid);
        const newCount = messageCount + 1;
        await setDoc(rateLimitRef, { count: newCount, lastMessageDate: Timestamp.now() }, { merge: true });
        setMessageCount(newCount);
        if (newCount >= MAX_MESSAGES_PER_DAY) {
            setRateLimited(true);
        }
    }
  };

  const addFeedback = async (feedback: string) => {
    if (!user) return;
    try {
        await addDoc(collection(db, 'feedback'), {
            userId: user.uid,
            userName: user.displayName,
            isGuest: user.isGuest,
            feedback,
            timestamp: Timestamp.now(),
            userAgent: navigator.userAgent,
        });
    } catch (error) {
        console.error("Error submitting feedback:", error);
    }
  };

  return { messages, loading, addMessage, isRateLimited, remainingMessages: MAX_MESSAGES_PER_DAY - messageCount, addFeedback };
};
