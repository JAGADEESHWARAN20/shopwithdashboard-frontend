// app/(auth)/register/page.tsx
"use client";

import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";

const RegisterPage = () => {
  const router = useRouter();

  const handleSwitchToLogin = () => {
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
        <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
      </div>
    </div>
  );
};

export default RegisterPage;