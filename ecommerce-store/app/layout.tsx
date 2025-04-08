import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Toaster } from 'react-hot-toast';
import ModalProvider from "@/providers/modal-providers";
import ToastProvider from "@/providers/toast-provider";
import Script from "next/script";
import { ClerkProvider,SignInButton,SignUpButton,SignedOut,SignedIn,UserButton } from '@clerk/nextjs';


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
    <ClerkProvider afterSignOutUrl="/sign-up">
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        </head>
        <header>
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      <body className={font.className}>
        <ModalProvider />
        <ToastProvider />
        <Navbar />
        <Toaster />
        {children}
        <Footer />
      </body>
      </html>
      </ClerkProvider>
  );
}