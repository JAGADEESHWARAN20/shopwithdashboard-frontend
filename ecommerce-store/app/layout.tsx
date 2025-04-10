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
import { postUserDataToAdminDashboard } from "@/actions/post-userdata";
import { useEffect } from "react";
import { currentUser } from "@clerk/nextjs/server";

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
  useEffect(() => {
    // Function to fetch user data and send it to the admin dashboard
    const fetchAndPostUserData = async () => {
      try {
        // Fetch user from Clerk
        const user = await currentUser();

        if (user) {
          const primaryEmailObj = user.emailAddresses.find(
            (email) => email.id === user.primaryEmailAddressId
          );

          const userData = {
            email: primaryEmailObj?.emailAddress || '',
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            image: user.imageUrl,
            emailVerified: primaryEmailObj?.verification?.status === 'verified',
            phone: user.phoneNumbers?.[0]?.phoneNumber || null,
            role: 'CUSTOMER', // Or extract from Clerk metadata
          };

          // Post the user data to the admin dashboard API
          await postUserDataToAdminDashboard(userData);
        }
      } catch (error) {
        console.error('Error fetching or posting user data:', error);
      }
    };

    // Call the function when the component mounts
    fetchAndPostUserData();
  }, []); // Empty dependency array ensures this runs once on component mount
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