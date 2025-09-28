import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "@/components/SessionWrapper";
import NavbarWrapper from "@/components/NavbarWrapper";

// Inter (body font)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Geist Sans (headings)
const geistSans = Geist({
  variable: "--font-heading",
  subsets: ["latin"],
});

// Geist Mono (code/mono text)
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GenUI",
  description: "An Web app for ui designs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <Toaster position="top-right" reverseOrder={false} />
          <NavbarWrapper />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
