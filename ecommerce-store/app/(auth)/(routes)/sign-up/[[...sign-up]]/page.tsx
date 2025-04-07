// app/(auth)/register/page.tsx
"use client";

import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";
import { Toaster } from "react-hot-toast"; // Make sure Toaster is included in your layout or here

const RegisterPage = () => {
  const router = useRouter();

  const handleSwitchToLogin = () => {
    router.push("/sign-in"); // Or your actual login route
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Ensure Toaster is rendered somewhere in your app tree */}
      <Toaster position="top-center" reverseOrder={false} />
      {/* Removed the outer h1 and div, let the RegisterForm handle its own structure */}
      <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
    </div>
  );
};

export default RegisterPage;