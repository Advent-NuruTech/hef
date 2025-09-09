"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Types
interface User {
  uid: string;
  displayName: string;
  photoURL: string | null;
  email: string;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Timestamp | null;
  unreadCount: number;
  otherUser: User;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

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

    // Fetch conversations where the current user is a participant
    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const conversationsMap = new Map<string, Conversation>();

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as {
          participants: string[];
          text: string;
          createdAt: Timestamp;
          senderId: string;
          read: boolean;
        };

        const otherUserId = data.participants.find((id) => id !== user.uid);
        if (!otherUserId) continue;

        if (!conversationsMap.has(otherUserId)) {
          // Fetch the other user's profile
          const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
          let otherUser: User = {
            uid: otherUserId,
            displayName: "Unknown User",
            photoURL: null,
            email: "",
          };

          if (otherUserDoc.exists()) {
            const userData = otherUserDoc.data() as Partial<User>;
            otherUser = {
              uid: otherUserId,
              displayName: userData.displayName || "Unknown User",
              photoURL: userData.photoURL || null,
              email: userData.email || "",
            };
          }

          conversationsMap.set(otherUserId, {
            id: otherUserId,
            participants: data.participants,
            lastMessage: data.text,
            lastMessageTime: data.createdAt || null,
            unreadCount: 0, // Placeholder for unread count
            otherUser,
          });
        } else {
          // Update if this is a newer message
          const existing = conversationsMap.get(otherUserId)!;
          if (
            existing.lastMessageTime &&
            data.createdAt.toMillis() > existing.lastMessageTime.toMillis()
          ) {
            conversationsMap.set(otherUserId, {
              ...existing,
              lastMessage: data.text,
              lastMessageTime: data.createdAt,
            });
          }
        }
      }

      setConversations(Array.from(conversationsMap.values()));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const markAsRead = async (conversationId: string) => {
    if (!currentUser) return;

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start a conversation with someone!</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              onClick={() => markAsRead(conversation.id)}
              className="flex items-center p-4 border-b hover:bg-gray-50"
            >
              <div className="relative">
                <Image
                  src={conversation.otherUser.photoURL || "/default-avatar.png"}
                  alt={conversation.otherUser.displayName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h2 className="font-semibold truncate">
                    {conversation.otherUser.displayName}
                  </h2>
                  <span className="text-xs text-gray-500">
                    {conversation.lastMessageTime
                      ? new Date(
                          conversation.lastMessageTime.toDate()
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
                <p className="text-gray-600 truncate">
                  {conversation.lastMessage
                    ? conversation.lastMessage.split(" ").slice(0, 20).join(" ") +
                      (conversation.lastMessage.split(" ").length > 20 ? "..." : "")
                    : "No messages yet"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
