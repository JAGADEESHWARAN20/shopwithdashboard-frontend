
import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Toaster } from 'react-hot-toast';
import ModalProvider from "@/providers/modal-providers";
import ToastProvider from "@/providers/toast-provider";
import Script from "next/script";
import { ClerkProvider } from '@clerk/nextjs';
import { UserProvider } from "@/contexts/user-context";

const font = Urbanist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Store",
  description: "Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <ClerkProvider afterSignOutUrl="/">
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        </head>
        <body className={font.className}>
          <UserProvider >
        <ModalProvider />
        <ToastProvider />
        <Navbar />
        <Toaster />
            {children}
            <Footer />
          </UserProvider>
      </body>
      </html>
      </ClerkProvider>
  );
}