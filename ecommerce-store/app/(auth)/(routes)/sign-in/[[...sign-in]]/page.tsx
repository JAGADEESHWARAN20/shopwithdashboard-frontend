// app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/signin-form";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}