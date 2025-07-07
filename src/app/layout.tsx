import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import NextAuthSessionProvider from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OWL - Teacher Farah's Gradebook",
  description: "Teacher Farah Tools - Gradebook, Attendance, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}
