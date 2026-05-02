import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oya Pray - Set Your Reminders",
  description: "Don't let me catch you ignoring this. Set your prayer reminders now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-oya-dark text-white min-h-screen`}>{children}</body>
    </html>
  );
}
