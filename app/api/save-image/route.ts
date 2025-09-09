import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const body = await req.json();
  const { url, title, description, userId, userName, userPhotoURL } = body;
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });
  await addDoc(collection(db, "hefGallery"), {
    url,
    title: title || "",
    description: description || "",
    userId: userId || null,
    userName: userName || "",
    userPhotoURL: userPhotoURL || null,
    likes: [],
    createdAt: serverTimestamp(),
  });
  return NextResponse.json({ success: true });
}