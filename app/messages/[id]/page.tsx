"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { db, auth } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Icons
import { FiSend, FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";

// Types
interface User {
  uid: string;
  displayName: string;
  photoURL: string | null;
  email: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: Timestamp;
  participants: string[];
  edited?: boolean;
  senderName?: string;
  senderPhotoURL?: string;
}

// Function to detect URLs and convert them to clickable links
const detectLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

export default function MessagePage() {
  const { id: receiverId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [receiver, setReceiver] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [isSending, setIsSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => scrollToBottom(), [messages, scrollToBottom]);

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/auth");
      return;
    }

    const user = auth.currentUser;
    setCurrentUser({
      uid: user.uid,
      displayName: user.displayName || "Unknown User",
      photoURL: user.photoURL,
      email: user.email || "",
    });

    const receiverUid = Array.isArray(receiverId)
      ? receiverId[0]
      : receiverId ?? "";

    // 🔥 Fetch receiver profile
    const unsubReceiver = onSnapshot(
      doc(db, "users", receiverUid),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setReceiver({
            uid: receiverUid,
            displayName: data.displayName || "Unknown User",
            photoURL: data.photoURL || null,
            email: data.email || "",
          });
        } else {
          setReceiver(null);
        }
        
      }
    );

    // 🔥 Fetch messages with attached sender profiles
    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", user.uid),
      orderBy("createdAt", "asc")
    );
    const unsubMessages = onSnapshot(q, async (snap) => {
      const msgs: Message[] = [];

      for (const docSnap of snap.docs) {
        const data = docSnap.data();
        const senderRef = doc(db, "users", data.senderId);
        const senderDoc = await getDoc(senderRef);

        msgs.push({
          id: docSnap.id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          text: data.text,
          createdAt: data.createdAt,
          participants: data.participants,
          edited: data.edited || false,
          senderName: senderDoc.exists()
            ? senderDoc.data().displayName
            : "Unknown",
          senderPhotoURL: senderDoc.exists()
            ? senderDoc.data().photoURL
            : "/default-avatar.png",
        });
      }

      setMessages(
        msgs.filter(
          (m) =>
            (m.senderId === user.uid && m.receiverId === receiverUid) ||
            (m.senderId === receiverUid && m.receiverId === user.uid)
        )
      );
    });

    return () => {
      unsubReceiver();
      unsubMessages();
    };
  }, [receiverId, router]);

  // send message
  const sendMessage = async () => {
    if (!text.trim() || !currentUser || !receiver || isSending) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, "messages"), {
        senderId: currentUser.uid,
        receiverId: receiver.uid,
        text,
        createdAt: serverTimestamp(),
        participants: [currentUser.uid, receiver.uid],
      });
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // edit message
  const startEditing = (message: Message) => {
    if (message.senderId !== currentUser?.uid) return;
    setEditingMessageId(message.id);
    setEditText(message.text);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const saveEditedMessage = async () => {
    if (!editingMessageId || !editText.trim()) return;

    try {
      const messageRef = doc(db, "messages", editingMessageId);
      await updateDoc(messageRef, {
        text: editText,
        edited: true,
      });
      setEditingMessageId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  // delete message
  const deleteMessage = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await deleteDoc(doc(db, "messages", messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Floating Header - removed shadow */}
      <div className="sticky top-0 z-10 flex items-center gap-2 p-4 border-b bg-white">
        {receiver && (
          <>
            <Image
              src={receiver.photoURL || "/default-avatar.png"}
              alt={receiver.displayName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-semibold">{receiver.displayName}</span>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${
              m.senderId === currentUser?.uid ? "justify-end" : "justify-start"
            }`}
          >
            {m.senderId !== currentUser?.uid && (
              <Link href={`/users/${m.senderId}`}>
                <Image
                  src={m.senderPhotoURL || "/default-avatar.png"}
                  alt={m.senderName || "user"}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </Link>
            )}
            <div
              className={`relative group p-2 rounded-lg max-w-xs ${
                m.senderId === currentUser?.uid
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {editingMessageId === m.id ? (
                <div className="flex flex-col">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="text-gray-800 p-1 rounded"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditedMessage();
                      if (e.key === "Escape") cancelEditing();
                    }}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={cancelEditing}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <FiX size={16} />
                    </button>
                    <button
                      onClick={saveEditedMessage}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <FiCheck size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>{detectLinks(m.text)}</p>
                  {m.edited && (
                    <span className="text-xs opacity-70 ml-1">(edited)</span>
                  )}
                </>
              )}

              {/* Message actions (only for current user's messages) - always visible for sender */}
              {m.senderId === currentUser?.uid && editingMessageId !== m.id && (
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <button
                    onClick={() => startEditing(m)}
                    className="p-1 rounded-full hover:bg-gray-200 opacity-80 hover:opacity-100"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteMessage(m.id)}
                    className="p-1 rounded-full hover:bg-gray-200 opacity-80 hover:opacity-100"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - removed focus ring */}
      <div className="p-3 border-t flex gap-2 items-center">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-0"
          disabled={isSending}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || isSending}
          className="bg-blue-500 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          {isSending ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-4 w-4 text-white mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            <FiSend size={18} />
          )}
        </button>
      </div>
    </div>
  );
}