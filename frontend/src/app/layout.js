import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Alomra - Sanctions disciplinaires",
  description: "Alomra - Sanctions disciplinaires",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/alomra.svg" type="image/svg+xml" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
