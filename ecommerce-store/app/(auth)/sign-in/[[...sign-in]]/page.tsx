"use client"

import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs'; // Or your preferred Clerk auth hook

export default function Page() {
     const router = useRouter();
     const { isSignedIn } = useAuth();

     useEffect(() => {
          if (isSignedIn) {
               // Redirect to the homepage or your desired logged-in route
               router.push('/');
          }
     }, [isSignedIn, router]);

     // If the user is already signed in, this component will likely not render for long
     return (
          <>
          <div className="flex justify-center items-center h-auto w-auto overflow-scroll scrollbar-hidden  bg-gray-100">


               <SignIn />


          </div>
          </>
     );
}