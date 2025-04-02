// app/(auth)/(routes)/sign-up/[[...sign-up]]/page.tsx
"use client";

import { SignUp } from "@clerk/nextjs";
import { useState } from "react";

const SignUpPage = () => {
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleSignUpError = (error: any) => {
    if (error.message.includes("single session mode")) {
      setSignupError("You're already signed in. Please sign out before creating a new account.");
    } else {
      setSignupError("An error occurred during signup.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        {signupError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{signupError}</span>
          </div>
        )}
        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage;