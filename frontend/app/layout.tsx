import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pahuna | Explore Surkhet and Karnali",
  description: "Surkhet-first Karnali tourism platform for stays, food, destinations, routes, and traveler profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-screen flex-col bg-[#fffaf0] text-stone-950">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
