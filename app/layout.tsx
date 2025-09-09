// app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "HEF Gallery",
  description: "Gallery system for HEF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
