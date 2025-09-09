"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import type { FirebaseError } from "firebase/app";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/"); // go home when logging in
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/setup"); // go to setup when signing up
      }
      setError(null);
    } catch (e) {
      const err = e as FirebaseError;
      setError(err.message.replace("Firebase:", "").trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-sm mx-auto">
      <input
        className="w-full p-2 border mb-2 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <input
        className="w-full p-2 border mb-2 rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="px-3 py-2 border rounded"
          disabled={loading}
        >
          Switch to {mode === "login" ? "Sign up" : "Login"}
        </button>
        <button
          onClick={submit}
          className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : mode === "login"
            ? "Login"
            : "Sign up"}
        </button>
      </div>
    </div>
  );
}
