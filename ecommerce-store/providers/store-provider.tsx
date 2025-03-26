"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Define a store type
type Store = {
     id: string;
     name: string;
     userId: string;
     storeUrl?: string;
     isActive: boolean;
     createdAt: string;
     updatedAt: string;
};

// Define the store context shape
interface StoreContextType {
     store: Store | null;
     isLoading: boolean;
     error: string | null;
     retryFetch: () => void;
}

// Default store for fallback
const DEFAULT_STORE: Store = {
     id: 'default-store-id',
     name: 'E-Commerce Store',
     userId: 'default-user-id',
     storeUrl: 'https://ecommercestore-online.vercel.app',
     isActive: true,
     createdAt: new Date().toISOString(),
     updatedAt: new Date().toISOString()
};

// Create the store context with default values
const StoreContext = createContext<StoreContextType>({
     store: null,
     isLoading: true,
     error: null,
     retryFetch: () => { }
});

// Custom hook for accessing store context
export const useStore = () => {
     const context = useContext(StoreContext);
     if (!context) {
          throw new Error("useStore must be used within a StoreProvider");
     }
     return context;
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
     const [store, setStore] = useState<Store | null>(null);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [retryCount, setRetryCount] = useState(0);

     const fetchStore = async () => {
          try {
               setIsLoading(true);
               setError(null);
               console.log("Fetching store data...");

               // Add a timestamp to prevent caching
               const response = await fetch(`/api/store?t=${Date.now()}`, {
                    // Add cache control to prevent stale responses
                    cache: "no-cache",
                    headers: {
                         'Cache-Control': 'no-cache, no-store, must-revalidate',
                         'Pragma': 'no-cache',
                         'Expires': '0'
                    }
               });

               if (!response.ok) {
                    console.error(`Failed to fetch store data: ${response.status}`);

                    // If we get a 400 or 404, use default store
                    if (response.status === 400 || response.status === 404) {
                         console.log("Using default store as fallback");
                         setStore(DEFAULT_STORE);
                         return;
                    }

                    throw new Error(`Failed to fetch store data: ${response.status}`);
               }

               const data = await response.json();
               console.log("Store data received:", data);

               // Validate the store data
               if (!data.name) {
                    console.warn("Store data is missing name, using default");
                    setStore(DEFAULT_STORE);
                    return;
               }

               setStore(data);

               // Save to sessionStorage for faster loading on subsequent page views
               try {
                    sessionStorage.setItem('store_data', JSON.stringify(data));
                    sessionStorage.setItem('store_timestamp', Date.now().toString());
               } catch (e) {
                    console.warn("Failed to save store data to sessionStorage", e);
               }

               // Only show toast in development
               if (process.env.NODE_ENV === 'development') {
                    toast.success(`Store loaded: ${data.name}`);
               }
          } catch (err) {
               console.error("Error fetching store:", err);
               const errorMessage = err instanceof Error ? err.message : "Failed to load store";
               setError(errorMessage);

               // Try to use cached data from sessionStorage
               try {
                    const cachedData = sessionStorage.getItem('store_data');
                    if (cachedData) {
                         console.log("Using cached store data");
                         setStore(JSON.parse(cachedData));
                         return;
                    }
               } catch (e) {
                    console.warn("Failed to retrieve cached store data", e);
               }

               // Use default store as fallback after multiple retries
               if (retryCount >= 2) {
                    console.log("Using default store after multiple failures");
                    setStore(DEFAULT_STORE);
               }

               // Only show toast in development
               if (process.env.NODE_ENV === 'development') {
                    toast.error(`Store error: ${errorMessage}`);
               }
          } finally {
               setIsLoading(false);
          }
     };

     const retryFetch = () => {
          setRetryCount(prev => prev + 1);
          fetchStore();
     };

     useEffect(() => {
          // Check if we have recent cached data first (less than 5 minutes old)
          try {
               const cachedData = sessionStorage.getItem('store_data');
               const timestamp = sessionStorage.getItem('store_timestamp');

               if (cachedData && timestamp) {
                    const age = Date.now() - parseInt(timestamp);
                    if (age < 5 * 60 * 1000) { // 5 minutes
                         console.log("Using recent cached store data");
                         setStore(JSON.parse(cachedData));
                         setIsLoading(false);
                         // Still fetch in background for latest data
                         fetchStore().catch(console.error);
                         return;
                    }
               }
          } catch (e) {
               console.warn("Failed to use cached store data", e);
          }

          // No valid cache, fetch fresh data
          fetchStore();
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

     return (
          <StoreContext.Provider value={{ store, isLoading, error, retryFetch }}>
               {children}
          </StoreContext.Provider>
     );
}; 