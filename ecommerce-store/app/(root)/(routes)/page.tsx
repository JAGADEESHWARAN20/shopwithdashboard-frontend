// app/layout.tsx
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
import { AuthProvider } from "@/context/auth-context"; // Add AuthProvider for custom auth context

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
     title: "Ecommerce Store",
     description: "Discover a wide range of products at our ecommerce store. Shop now for the best deals!",
};

interface RootLayoutProps {
     children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
     return (
          <html lang="en">
               <head>
                    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
               </head>
               <body className={font.className}>
                    <ClerkProvider
                         afterSignOutUrl="/"
                         publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
                         signInFallbackRedirectUrl="/dashboard"
                         signUpFallbackRedirectUrl="/dashboard"
                    >
                         <AuthProvider>
                              <ModalProvider />
                              <ToastProvider />
                              <Navbar />
                              <Toaster />
                              {children}
                              <Footer />
                         </AuthProvider>
                    </ClerkProvider>
               </body>
          </html>
     );
}