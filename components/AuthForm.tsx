"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import type { FirebaseError } from "firebase/app";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const router = useRouter();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Check if setup is completed
        const setupSnap = await getDoc(doc(db, "setupStatus", firebaseUser.uid));
        if (!setupSnap.exists()) {
          router.replace("/setup");
        } else {
          router.replace("/members");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!email || !password || !confirmPassword || !securityQuestion || !securityAnswer) {
          setError("All fields are required");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const userCred = await createUserWithEmailAndPassword(auth, email, password);

        // Save security question & answer keyed by email (testing only)
        await setDoc(doc(db, "securityQuestions", email), {
          question: securityQuestion,
          answer: securityAnswer,
          password, // Plaintext for testing. Never use in production.
        });

        setSuccess("Account created! Redirecting to setup...");
        setTimeout(() => router.replace("/setup"), 1000);
      }

      if (mode === "login") {
        if (!email || !password) {
          setError("Email and password are required");
          setLoading(false);
          return;
        }

        await setPersistence(auth, browserLocalPersistence);
        await signInWithEmailAndPassword(auth, email, password);

        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const setupSnap = await getDoc(doc(db, "setupStatus", currentUser.uid));
        if (!setupSnap.exists()) {
          router.replace("/setup");
        } else {
          router.replace("/members");
        }
      }

      if (mode === "forgot") {
        if (!email || !securityAnswer) {
          setError("Email and answer are required");
          setLoading(false);
          return;
        }

        const docSnap = await getDoc(doc(db, "securityQuestions", email));
        if (!docSnap.exists()) {
          setError("User not found");
          setLoading(false);
          return;
        }

        const data = docSnap.data();
        if (data.answer === securityAnswer) {
          setSuccess(`Your password is: ${data.password}`);
        } else {
          setError("Incorrect answer");
        }
      }
    } catch (e) {
      const err = e as FirebaseError;
      setError(err.message.replace("Firebase:", "").trim());
      if (mode === "login") setFailedAttempts((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        {mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : "Forgot Password"}
      </h2>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full p-2 border rounded mb-3"
          required
        />

        {mode !== "forgot" && (
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full p-2 border rounded"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        )}

        {mode === "signup" && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full p-2 border rounded mb-3"
              required
              minLength={6}
            />
            <input
              type="text"
              placeholder="Security Question"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              disabled={loading}
              className="w-full p-2 border rounded mb-3"
              required
            />
            <input
              type="text"
              placeholder="Answer to Security Question"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              disabled={loading}
              className="w-full p-2 border rounded mb-3"
              required
            />
          </>
        )}

        {mode === "forgot" && (
          <input
            type="text"
            placeholder="Answer to Security Question"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            disabled={loading}
            className="w-full p-2 border rounded mb-3"
            required
          />
        )}

        {error && <div className="p-2 mb-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
        {success && <div className="p-2 mb-3 bg-green-100 text-green-700 rounded text-sm">{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded mb-3 disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Sign Up"
            : "Reveal Password"}
        </button>

        <div className="text-center">
          {mode === "login" && failedAttempts >= 2 && (
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError(null);
                setSuccess(null);
              }}
              className="text-red-600 text-sm mb-2 block"
            >
              Forgot Password?
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
              setSuccess(null);
            }}
            className="text-blue-600 text-sm"
          >
            {mode === "login" ? "Need an account? Sign Up" : "Back to Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
