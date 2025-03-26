import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Toaster } from 'react-hot-toast';
import ModalProvider from "@/providers/modal-providers";
import ToastProvider from "@/providers/toast-provider";
import Script from "next/script";
import { StoreProvider } from "@/providers/store-provider";

const font = Urbanist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "E-Commerce Store",
  description: "Your one-stop shop for all your needs",
  keywords: "ecommerce, shopping, online store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={font.className}>
        <StoreProvider>
          <ModalProvider />
          <ToastProvider />
          <Navbar />
          <Toaster position="top-center" />
          <div className="flex min-h-screen flex-col">
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}