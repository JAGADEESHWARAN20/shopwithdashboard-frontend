// actions/auth/signup.ts
import { AuthResponse } from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const signup = async (email: string, password: string, name: string): Promise<AuthResponse | null> => {
     try {
          const res = await fetch(`${API_URL}/auth/signup`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ email, password, name }),
          });
          if (!res.ok) {
               throw new Error(`Sign-up failed: ${res.status} ${res.statusText}`);
          }
          const data = await res.json();
          return data as AuthResponse;
     } catch (error) {
          console.error("Error signing up:", error);
          return null;
     }
};