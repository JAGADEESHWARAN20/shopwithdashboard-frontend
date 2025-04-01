// actions/auth/logout.ts
import { LogoutResponse } from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const logout = async (token: string): Promise<LogoutResponse | null> => {
     try {
          const res = await fetch(`${API_URL}/auth/logout`, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               },
          });
          if (!res.ok) {
               throw new Error(`Logout failed: ${res.status} ${res.statusText}`);
          }
          const data = await res.json();
          return data as LogoutResponse;
     } catch (error) {
          console.error("Error logging out:", error);
          return null;
     }
};