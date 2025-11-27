// lib/googleDrive.ts
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

export const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function uploadToDrive(fileName: string, buffer: Buffer, mimeType: string) {
  const res = await drive.files.create({
    requestBody: { name: fileName },
    media: { mimeType, body: Buffer.from(buffer) },
    fields: "id",
  });

  const fileId = res.data.id;
  if (!fileId) {
    throw new Error("Google Drive upload failed: no file ID returned");
  }

  await drive.permissions.create({
    fileId: fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  const publicUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
  return publicUrl;
}
