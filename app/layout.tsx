import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Young Evangelists Ministry | OLD SDA CHURCH",
  description:
    "Official website of the Young Evangelists Ministry – a dynamic mission team dedicated to restoring the old foundations, uplifting truth, and preparing a people ready for the Lord’s return.",
  icons: {
    icon: "/favicon.ico", // ✅ Using your logo
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://yourwebsite.com",
    title: "Young Evangelists Ministry | OLD SDA CHURCH",
    description:
      "Official website of the Young Evangelists Ministry – restoring old foundations and preparing a people ready for the Lord’s return.",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
        alt: "Young Evangelists Ministry Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Young Evangelists Ministry | OLD SDA CHURCH",
    description:
      "Official website of the Young Evangelists Ministry – restoring old foundations and preparing a people ready for the Lord’s return.",
    images: ["/favicon.ico"],
  },
  themeColor: "#1f2937",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="light">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
