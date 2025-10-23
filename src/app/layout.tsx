import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import NavbarWrapper from "@/components/NavbarWrapper";
import { ThemeProvider } from "next-themes";
import Toastwrapper from "@/components/Toastwrapper";
import { ProjectProvider } from "@/components/context/ProjectProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});


const geistSans = Geist({ variable: "--font-heading", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });


export const metadata: Metadata = {
  title: "GenUI",
  description: "A Web app for ui designs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${geistSans.className} ${geistMono.className} antialiased `} >
        <ProjectProvider>
          <ThemeProvider defaultTheme="system" attribute="class" >
            <SessionWrapper >
              <Toastwrapper />
              <NavbarWrapper />
              {children}
            </SessionWrapper>
          </ThemeProvider>
        </ProjectProvider>
      </body>
    </html>
  );
}
