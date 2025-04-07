// actions/user/get-profile.ts
import axios from 'axios';
import { UserProfile } from "@/types"; // Assuming you have this type defined based on your backend response

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

if (!API_URL) {
     console.error("Error: NEXT_PUBLIC_API_URL is not defined.");
}

/**
 * Fetches the user's profile data from the backend.
 * Assumes the function is called from a context where Clerk's token can be provided.
 * @param token - The Clerk authentication token.
 */
export const getProfile = async (token: string): Promise<UserProfile | { error: string }> => {
     if (!API_URL) {
          return { error: "API URL is not configured." };
     }
     if (!token) {
          return { error: "Authentication token is required." };
     }

     try {
          const response = await axios.get<UserProfile>(`${API_URL}/user/profile`, {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          });
          return response.data;
     } catch (error) {
          console.error("Error fetching profile:", error);
          let errorMessage = "Failed to fetch user profile.";

          if (axios.isAxiosError(error)) {
               const serverError = error.response?.data?.error;
               if (serverError) {
                    errorMessage = serverError;
               } else if (error.response?.status === 401 || error.response?.status === 403) {
                    errorMessage = "Unauthorized. Please log in again.";
               } else if (error.response?.status) {
                    errorMessage = `Failed to fetch profile: Server responded with ${error.response.status}.`;
               } else if (error.request) {
                    errorMessage = "Could not connect to backend service to fetch profile.";
               }
          } else if (error instanceof Error) {
               errorMessage = error.message;
          }
          return { error: errorMessage };
     }
};

/*
 * Example Usage within a component/hook using Clerk:
 *
 * import { useAuth } from "@clerk/nextjs";
 * import { getProfile } from "@/actions/user/get-profile";
 * import { useState, useEffect } from "react";
 *
 * function UserProfileComponent() {
 * const { getToken } = useAuth();
 * const [profile, setProfile] = useState(null);
 * const [error, setError] = useState(null);
 *
 * useEffect(() => {
 * const fetchProfile = async () => {
 * try {
 * const token = await getToken();
 * if (token) {
 * const result = await getProfile(token);
 * if ('error' in result) {
 * setError(result.error);
 * setProfile(null);
 * } else {
 * setProfile(result);
 * setError(null);
 * }
 * } else {
 * setError("Not authenticated");
 * }
 * } catch (err) {
 * console.error("Error getting token or fetching profile:", err);
 * setError("An unexpected error occurred.");
 * }
 * };
 * fetchProfile();
 * }, [getToken]);
 *
 * // Render profile or error state...
 * }
 */