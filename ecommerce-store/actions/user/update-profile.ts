// actions/user/update-profile.ts
import { User } from "@/types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface UpdateProfileResponse {
     user: User;
}

export const updateProfile = async (
     token: string,
     data: { name?: string; phone?: string; address?: string; image?: string }
): Promise<UpdateProfileResponse | null> => {
     try {
          const res = await fetch(`${API_URL}/user/profile`, {
               method: "PATCH",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify(data),
          });
          if (!res.ok) {
               throw new Error(`Failed to update profile: ${res.status} ${res.statusText}`);
          }
          const response = await res.json();
          return response as UpdateProfileResponse;
     } catch (error) {
          console.error("Error updating profile:", error);
          return null;
     }
};