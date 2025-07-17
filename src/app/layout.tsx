import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "reflect-metadata";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ElevaCursos",
  description: "Uma plataforma simples e intuitiva para ensinar e aprender",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interSans.className}>
      <AuthProvider>
        <Navbar />
        <Toaster position="top-right" />
        <body className={`antialiased bg-[white!important]`}>{children}</body>
      </AuthProvider>
    </html>
  );
}
