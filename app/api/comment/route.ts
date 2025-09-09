import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const { imageId, userId, text } = await req.json();
  if (!imageId || !userId || !text) return NextResponse.json({ error: "missing" }, { status: 400 });
  await addDoc(collection(db, "comments"), {
    imageId,
    userId,
    text,
    createdAt: serverTimestamp(),
  });
  return NextResponse.json({ success: true });
}