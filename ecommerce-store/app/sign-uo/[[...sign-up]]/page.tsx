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
               router.push('/'); // Redirect to homepage after successful signup
          }
     }, [isSignedIn, router]);

     return (
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
               
                  
                    <SignUp
                         appearance={{
                              elements: {
                                   formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 px-4 w-full',
                                   formButtonSecondary: 'bg-gray-300 hover:bg-gray-400 text-gray-800 rounded py-2 px-4 w-full mt-2',
                                   footerAction: 'text-indigo-600 hover:underline',
                                   formFieldInput: 'border border-gray-300 rounded py-2 px-3 w-full mt-2 focus:outline-none focus:border-indigo-500',
                                   formFieldLabel: 'block text-gray-700 text-sm font-bold mb-2',
                                   socialButtonsBlock: 'mt-4',
                                   socialButton: 'flex items-center justify-center rounded py-2 px-4 w-full border hover:bg-gray-100 text-gray-700',
                                   socialButtonIcon: 'mr-2',
                              },
                         }}
                    />
                    
          
          </div>
     );
}