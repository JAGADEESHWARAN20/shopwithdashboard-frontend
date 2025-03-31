import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import ModalProvider from "@/providers/modal-providers";
import ToastProvider from "@/providers/toast-provider";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store",
  description: "Store",
};

interface EcommerceStoreProps {
  children: ReactNode;
  pageProps?: any;
}

export default function RootLayout({ children, pageProps }: EcommerceStoreProps) {
  return (
    <html lang="en">
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      </head>
      <body className={font.className}>
        <ModalProvider />
        <ToastProvider />
        <Navbar /> {/* Static Navbar */}
        <Toaster />
        <ClerkProvider
          afterSignOutUrl={'/'}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          fallbackRedirectUrl="/dashboard" // Changed from signInFallbackRedirectUrl
          {...pageProps}
        >
          {children}
         
        </ClerkProvider>
        
        <Footer />
      </body>
    </html>
  );
}