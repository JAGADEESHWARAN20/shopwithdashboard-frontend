// actions/user/sync-clerk-user.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
     console.error("Error: NEXT_PUBLIC_API_URL is not defined.");
     // Consider throwing an error or having a default fallback for critical configuration
}

interface SyncUserData {
     id: string; // Clerk User ID
     email: string;
     name?: string;
     phone?: string;
     address?: string;
     // Role and emailVerified are typically set server-side during creation
}

interface SyncUserResponse {
     user: { // Define the expected user structure returned by your backend
          id: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          address?: string | null;
          role: string; // e.g., 'CUSTOMER' or 'ADMIN'
          emailVerified: boolean;
          // Add other fields returned by your API if necessary
     };
}

/**
 * Sends user details to the backend to create/sync the user record
 * after successful Clerk signup and verification.
 * @param userData - The user data collected during signup.
 */
export const syncClerkUser = async (userData: SyncUserData): Promise<SyncUserResponse | { error: string }> => {
     if (!API_URL) {
          return { error: "API URL is not configured." };
     }
     // Use the correct endpoint matching your backend route
     const syncEndpoint = `${API_URL}/api/user/create`; // OR /api/auth/create

     try {
          const response = await axios.post<SyncUserResponse>(syncEndpoint, userData, {
               headers: {
                    'Content-Type': 'application/json',
               },
          });

          // Log success and return data from backend
          console.log("Backend user sync successful:", response.data);
          return response.data;

     } catch (error) {
          console.error("Error syncing user data to backend:", error);
          let errorMessage = "Failed to save user details to backend.";

          if (axios.isAxiosError(error)) {
               const serverError = error.response?.data?.error;
               const serverMessage = error.response?.data?.message; // Handle cases where backend sends 'message'
               if (serverError) {
                    errorMessage = serverError;
               } else if (serverMessage) {
                    errorMessage = serverMessage;
               } else if (error.response?.status) {
                    errorMessage = `Backend sync failed with status ${error.response.status}.`;
               } else if (error.request) {
                    errorMessage = "Could not connect to backend service for user sync.";
               }
          } else if (error instanceof Error) {
               errorMessage = error.message;
          }

          return { error: errorMessage };
     }
};