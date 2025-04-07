// actions/user/update-profile.ts
import axios from 'axios';
import { User } from "@/types"; // Assuming User type represents the full profile

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

if (!API_URL) {
     console.error("Error: NEXT_PUBLIC_API_URL is not defined.");
}

interface UpdateProfileData {
     name?: string;
     phone?: string;
     address?: string;
     image?: string; // Assuming image URL or similar
     // Add any other fields your backend /user/profile PATCH endpoint accepts
}

interface UpdateProfileResponse {
     user: User; // Expect the updated user profile back
}

/**
 * Updates the user's profile data via the backend.
 * Assumes the function is called from a context where Clerk's token can be provided.
 * @param token - The Clerk authentication token.
 * @param data - The profile data fields to update.
 */
export const updateProfile = async (
     token: string,
     data: UpdateProfileData
): Promise<UpdateProfileResponse | { error: string }> => {
     if (!API_URL) {
          return { error: "API URL is not configured." };
     }
     if (!token) {
          return { error: "Authentication token is required." };
     }

     try {
          const response = await axios.patch<UpdateProfileResponse>(`${API_URL}api/user/profile`, data, {
               headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
               },
          });
          return response.data;
     } catch (error) {
          console.error("Error updating profile:", error);
          let errorMessage = "Failed to update user profile.";

          if (axios.isAxiosError(error)) {
               const serverError = error.response?.data?.error;
               if (serverError) {
                    errorMessage = serverError;
               } else if (error.response?.status === 401 || error.response?.status === 403) {
                    errorMessage = "Unauthorized. Please log in again.";
               } else if (error.response?.status === 400) {
                    errorMessage = serverError || "Invalid data provided for update.";
               } else if (error.response?.status) {
                    errorMessage = `Failed to update profile: Server responded with ${error.response.status}.`;
               } else if (error.request) {
                    errorMessage = "Could not connect to backend service to update profile.";
               }
          } else if (error instanceof Error) {
               errorMessage = error.message;
          }
          return { error: errorMessage };
     }
};

/*
 * Example Usage within a component/hook using Clerk:
 * (Similar pattern to getProfile, call getToken() first, then call updateProfile)
 *
 * const handleUpdate = async (updateData) => {
 * try {
 * const token = await getToken();
 * if(token) {
 * const result = await updateProfile(token, updateData);
 * if('error' in result) {
 * // handle error display
 * } else {
 * // handle success, maybe update local state with result.user
 * }
 * }
 * } catch (err) { // handle error getting token }
 * }
 */