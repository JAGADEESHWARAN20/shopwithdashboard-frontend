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

               const response = await fetch("/api/store", {
                    // Add cache control to prevent stale responses
                    cache: "no-cache",
                    headers: {
                         'Cache-Control': 'no-cache',
                         'Pragma': 'no-cache'
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

               setStore(data);

               // Show toast for development environment
               if (process.env.NODE_ENV === 'development') {
                    toast.success(`Store loaded: ${data.name}`);
               }
          } catch (err) {
               console.error("Error fetching store:", err);
               const errorMessage = err instanceof Error ? err.message : "Failed to load store";
               setError(errorMessage);

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
          fetchStore();
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

     return (
          <StoreContext.Provider value={{ store, isLoading, error, retryFetch }}>
               {children}
          </StoreContext.Provider>
     );
}; 