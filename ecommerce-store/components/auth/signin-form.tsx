// components/auth/signin-form.tsx
import { useState } from "react";
import { signin } from "@/actions/auth/signin";
import { useAuthHook } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
     const { setAuth } = useAuthHook();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await signin(email, password);
    if (response) {
      setAuth(response.token, response.user);
      router.push("/"); // Redirect to main page
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Sign In</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">
        Sign In
      </button>
    </form>
  );
};