import "./globals.css";
import { Metadata } from 'next'
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
  title: {
    default: 'Store | Your Premium Shopping Destination',
    template: '%s | Store'
  },
  description: 'Discover our premium collection of products. Shop the latest trends in fashion, electronics, and more.',
  keywords: ['ecommerce', 'shop', 'online store', 'fashion', 'electronics'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_STORE_URL || 'https://store.admindashboardecom.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Store | Your Premium Shopping Destination',
    description: 'Discover our premium collection of products. Shop the latest trends in fashion, electronics, and more.',
    url: process.env.NEXT_PUBLIC_STORE_URL,
    siteName: 'Store',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Store | Your Premium Shopping Destination',
    card: 'summary_large_image',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
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