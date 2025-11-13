import React, { useState, useEffect, useRef } from "react";
import { auth, provider, db, signInWithPopup, signOut} from "./firebase";
import type { User } from "firebase/auth";
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaGoogle, FaSignOutAlt } from "react-icons/fa";
import "./index.css";

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
    const unsubscribe = auth.onAuthStateChanged(setUser);
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
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMsg: ChatMessage = {
      text: input,
      type: "user",
      createdAt: Timestamp.now(),
      userName: user.displayName || "Anonymous",
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BKEND}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();

      const botMsg: ChatMessage = {
        text: data.response,
        type: "bot",
        createdAt: Timestamp.now(),
        userName: "Bot",
      };

      setMessages(prev => [...prev, botMsg]);

      // Save both messages to Firestore
      for (const msg of [userMsg, botMsg]) {
        await addDoc(collection(db, "chats"), msg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="container py-5">
      {!user ? (
        <div className="text-center login-screen">
          <h2>Shadow Fight AI Agent By Fate</h2>
          <button className="btn btn-outline-primary mt-3" onClick={handleLogin}>
            <FaGoogle /> Sign in with Google
          </button>
        </div>
      ) : (
        <div className="card shadow-lg chat-card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4>Agent by Fate</h4>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
          <div className="card-body chat-body">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id || Math.random()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`chat-bubble ${msg.type}`}
                >
                  {msg.text.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  className="chat-bubble bot typing"
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
          <div className="card-footer input-group input-bubble-bg">
            <input
              type="text"
              className="form-control"
              placeholder="Ask about any Shadow Fight character..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}

      {/* Floating doodles with parallax */}
      <svg className="doodle-bg" width="100%" height="100%">
        <circle className="doodle1" cx="50" cy="80" r="60" fill="rgba(255,200,150,0.3)" />
        <circle className="doodle2" cx="300" cy="150" r="100" fill="rgba(150,200,255,0.2)" />
        <circle className="doodle3" cx="700" cy="50" r="120" fill="rgba(255,150,200,0.15)" />
      </svg>
    </div>
  );
}

export default App
