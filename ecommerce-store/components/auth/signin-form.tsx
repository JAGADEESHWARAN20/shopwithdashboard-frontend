// components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError(null);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        toast.success("Logged in successfully!");
        router.push("/");
      } else {
        setError("Login failed. Please check your credentials.");
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(err.errors?.[0]?.message || "An error occurred during login.");
      toast.error(err.errors?.[0]?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !isLoaded}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Logging In..." : "Log In"}
        </button>
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};