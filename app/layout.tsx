import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // ✅ Import the footer
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Young Evangelists Ministry | OLD SDA CHURCH",
  description:
    "Official website of the Young Evangelists Ministry – a dynamic mission team  dedicated to restoring the old foundations, uplifting truth, and preparing a people ready for the Lord’s return.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow max-w-6xl mx-auto p-4">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
