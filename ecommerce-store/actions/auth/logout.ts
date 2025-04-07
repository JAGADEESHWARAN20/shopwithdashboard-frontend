// actions/auth/logout.ts
import axios from 'axios';
import { LogoutResponse } from "@/types"; // Define this type if your backend returns specific data

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

if (!API_URL) {
     console.error("Error: NEXT_PUBLIC_API_URL is not defined.");
}

/**
 * Sends a request to the backend logout endpoint, if required.
 * IMPORTANT: This should typically be called alongside Clerk's signOut() on the frontend.
 * @param token - The Clerk authentication token.
 */
export const logoutBackendSession = async (token: string): Promise<LogoutResponse | { error: string } | null> => {
     if (!API_URL) {
          console.warn("Logout action called but API URL is not configured.");
          return null; // Or return an error if this backend call is critical
     }
     if (!token) {
          return { error: "Authentication token is required for backend logout." };
     }

     try {
          // Adjust endpoint if needed
          const response = await axios.post<LogoutResponse>(`${API_URL}api/auth/logout`, {}, { // Sending empty body unless backend expects something
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          });
          console.log("Backend logout successful:", response.data);
          return response.data;
     } catch (error) {
          console.error("Error logging out backend session:", error);
          // Decide if this error should block frontend logout
          let errorMessage = "Failed to notify backend of logout.";
          if (axios.isAxiosError(error)) {
               // Handle specific errors if needed (e.g., 401 might mean session already expired)
               const serverError = error.response?.data?.error;
               if (serverError) errorMessage = serverError;
          } else if (error instanceof Error) {
               errorMessage = error.message;
          }
          return { error: errorMessage };
     }
};

/*
 * Example Usage alongside Clerk's signOut:
 *
 * import { useClerk } from "@clerk/nextjs";
 * import { logoutBackendSession } from "@/actions/auth/logout";
 *
 * function LogoutButton() {
 * const { signOut, session } = useClerk();
 *
 * const handleLogout = async () => {
 * try {
 * // Optional: Notify backend first
 * if (session) { // Only if user is actually logged in
 * const token = await session.getToken();
 * if (token) {
 * const backendResult = await logoutBackendSession(token);
 * if (backendResult && 'error' in backendResult) {
 * console.warn("Backend logout failed:", backendResult.error);
 * // Decide if you want to proceed with frontend logout anyway
 * }
 * }
 * }
 * } catch (err) {
 * console.error("Error during backend logout notification:", err);
 * } finally {
 * // Always perform Clerk sign out
 * await signOut(() => {
 * // Optional redirect after sign out
 * // router.push("/");
 * });
 * }
 * }
 *
 * return <button onClick={handleLogout}>Logout</button>
 * }
 */