import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export async function POST(req: Request) {
  const { imageId, userId } = await req.json();
  if (!imageId || !userId) return NextResponse.json({ error: "missing" }, { status: 400 });
  const ref = doc(db, "hefGallery", imageId);
  await updateDoc(ref, { likes: arrayUnion(userId) });
  return NextResponse.json({ success: true });
}