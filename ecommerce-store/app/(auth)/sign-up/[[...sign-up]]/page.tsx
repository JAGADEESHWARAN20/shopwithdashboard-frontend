"use client";

import { SignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function SignUpPage() {
     const router = useRouter();
     const { isSignedIn } = useAuth();

     useEffect(() => {
          if (isSignedIn) {
               router.push('/sign-in');
          }
     }, [isSignedIn, router]);

     return (
          <div className="flex justify-center items-center h-auto w-auto overflow-scroll scrollbar-hidden  bg-gray-100">
               
                  
                    <SignUp/>
                    
          
          </div>
     );
}