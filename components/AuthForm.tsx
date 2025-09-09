"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import type { FirebaseError } from "firebase/app";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    try {
      if (mode === "login") {
        // Persistent login if "remember me" is checked
        if (rememberMe) {
          await setPersistence(auth, browserLocalPersistence);
        }
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/");
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/setup");
      } else if (mode === "reset") {
        await sendPasswordResetEmail(auth, email);
        setError("Password reset link sent! Check your email.");
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
      {/* Email */}
      <input
        className="w-full p-2 border mb-2 rounded"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      {/* Password */}
      {mode !== "reset" && (
        <input
          className="w-full p-2 border mb-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          onCopy={(e) => e.preventDefault()} // prevent copy
          onPaste={(e) => e.preventDefault()} // prevent paste
        />
      )}

      {/* Confirm Password (Signup only) */}
      {mode === "signup" && (
        <input
          className="w-full p-2 border mb-2 rounded"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          onCopy={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
        />
      )}

      {/* Remember Me (Login only) */}
      {mode === "login" && (
        <label className="flex items-center gap-2 mb-2 text-sm">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
      )}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="flex gap-2 flex-wrap">
        {/* Switch mode */}
        <button
          onClick={() =>
            setMode(
              mode === "login"
                ? "signup"
                : mode === "signup"
                ? "reset"
                : "login"
            )
          }
          className="px-3 py-2 border rounded"
          disabled={loading}
        >
          {mode === "login"
            ? "Switch to Sign up"
            : mode === "signup"
            ? "Forgot Password?"
            : "Back to Login"}
        </button>

        {/* Submit */}
        <button
          onClick={submit}
          className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Sign up"
            : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
