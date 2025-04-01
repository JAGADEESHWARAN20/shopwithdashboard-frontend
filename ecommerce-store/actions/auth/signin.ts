// actions/auth/signin.ts
import { AuthResponse } from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const signin = async (email: string, password: string): Promise<AuthResponse | null> => {
     try {
          const res = await fetch(`${API_URL}/auth/signin`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
               throw new Error(`Sign-in failed: ${res.status} ${res.statusText}`);
          }
          const data = await res.json();
          return data as AuthResponse;
     } catch (error) {
          console.error("Error signing in:", error);
          return null;
     }
};