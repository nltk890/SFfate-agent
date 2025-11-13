import React, { useState, useEffect, useRef } from "react";
// Import Firebase services from the npm packages
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import type { User } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp 
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
// Import icons from lucide-react
import { Send, LogOut } from "lucide-react";

// --- Firebase Configuration ---
// This assumes you have these variables in your .env file
// (e.g., VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
// --- End Firebase Configuration ---


interface ChatMessage {
  id?: string;
  text: string;
  type: "user" | "bot";
  createdAt?: Timestamp;
  userName?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    // Use the onAuthStateChanged from the imported auth module
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "chats"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs: ChatMessage[] = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as ChatMessage) }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      // Use the imported signInWithPopup, auth, and provider
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    // Use the imported signOut and auth
    await signOut(auth);
  };

  const sendMessage = async () => {
    const currentInput = input.trim();
    if (!currentInput || !user) return;

    const userMsg: ChatMessage = {
      text: currentInput,
      type: "user",
      createdAt: Timestamp.now(),
      userName: user.displayName || "Anonymous",
    };

    setInput("");
    setLoading(true);

    try {
      await addDoc(collection(db, "chats"), userMsg);

      const response = await fetch(`${import.meta.env.VITE_BKEND}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        text: data.response || "I'm sorry, I couldn't process that.",
        type: "bot",
        createdAt: Timestamp.now(),
        userName: "Bot",
      };

      await addDoc(collection(db, "chats"), botMsg);

    } catch (err) {
      console.error("Error sending message:", err);
      const errorMsg: ChatMessage = {
        text: `Error: ${err.message}`,
        type: "bot",
        createdAt: Timestamp.now(),
        userName: "Bot",
      };
      await addDoc(collection(db, "chats"), errorMsg);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    // Replaced Bootstrap with Tailwind classes
    <div className="container mx-auto py-5 px-4 h-screen flex items-center justify-center font-sans">
      {!user ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Shadow Fight AI Agent By Fate</h2>
          <button 
            className="flex items-center justify-center gap-2 border border-blue-500 text-blue-500 px-4 py-2 rounded-lg mt-3 hover:bg-blue-50 transition-colors"
            onClick={handleLogin}
          >
            <FaGoogle /> Sign in with Google
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg max-w-2xl w-full h-[80vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h4 className="text-xl font-semibold">Agent by Fate</h4>
            <button 
              className="flex items-center gap-2 border border-red-500 text-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-50 transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
          <div className="p-4 flex-1 h-full overflow-y-auto flex flex-col space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg max-w-[75%] ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white self-end'
                      : 'bg-gray-200 text-gray-800 self-start'
                  }`}
                >
                  {/* This still needs a Markdown renderer for full formatting */}
                  {msg.text.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  className="p-3 rounded-lg bg-gray-200 text-gray-800 self-start italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Typing...
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t flex items-center gap-2 bg-gray-50 rounded-b-lg">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask about any Shadow Fight character..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button 
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              onClick={sendMessage} 
              disabled={loading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
