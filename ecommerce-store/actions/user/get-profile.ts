// actions/user/get-profile.ts
import { useAuth } from "@clerk/nextjs";
import { UserProfile } from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const getProfile = async (): Promise<UserProfile | null> => {
     try {
          const { getToken } = useAuth();
          const token = await getToken();
          if (!token) {
               throw new Error("No authentication token available");
          }

          const res = await fetch(`${API_URL}/user/profile`, {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          });
          if (!res.ok) {
               throw new Error(`Failed to fetch profile: ${res.status} ${res.statusText}`);
          }
          const data = await res.json();
          return data as UserProfile;
     } catch (error) {
          console.error("Error fetching profile:", error);
          return null;
     }
};