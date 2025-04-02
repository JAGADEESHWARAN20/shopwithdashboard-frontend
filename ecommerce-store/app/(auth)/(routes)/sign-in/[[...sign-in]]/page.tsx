// app/(auth)/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/signin-form";

export default function LoginPage() {
  const router = useRouter();

  const handleSwitchToRegister = () => {
    router.push("/sign-up");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm onSwitchToRegister={handleSwitchToRegister} />
    </div>
  );
}