"use client";  // Add this at the top of the file

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { User } from '@/types';
import { getUserData, postUserDataToAdminDashboard } from "@/actions/post-userdata"; // Import the updated functions

interface UserContextType {
     user: User | null;
     isLoading: boolean;
     error: string | null;
     refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
     user: null,
     isLoading: true,
     error: null,
     refreshUser: async () => { },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
     const [user, setUser] = useState<User | null>(null);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const { userId, getToken } = useAuth();

     useEffect(() => {
          const fetchAndPostUserData = async () => {
               try {
                    // Fetch user from Clerk using the `getUserData` function
                    const userData = await getUserData();
                    if (userData) {
                         // Post the user data to the admin dashboard API
                         await postUserDataToAdminDashboard(userData);
                    }
               } catch (error) {
                    console.error('Error fetching or posting user data:', error);
               }
          };

          // Call the function when the component mounts
          fetchAndPostUserData();
     }, []); // Empty dependency array ensures this runs once on component mount

     const fetchUser = async () => {
          try {
               setIsLoading(true);
               setError(null);

               if (!userId) {
                    setUser(null);
                    return;
               }

               const token = await getToken();
               const response = await fetch('/api/user', {
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
               });

               if (!response.ok) {
                    throw new Error('Failed to fetch user data');
               }

               const userData = await response.json();
               setUser(userData);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Unknown error occurred');
               setUser(null);
          } finally {
               setIsLoading(false);
          }
     };

     useEffect(() => {
          fetchUser();
     }, [userId]);

     return (
          <UserContext.Provider
               value={{
                    user,
                    isLoading,
                    error,
                    refreshUser: fetchUser,
               }}
          >
               {children}
          </UserContext.Provider>
     );
}

export const useUser = () => useContext(UserContext);
