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
}

// Create the store context with default values
const StoreContext = createContext<StoreContextType>({
     store: null,
     isLoading: true,
     error: null,
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

     useEffect(() => {
          const fetchStore = async () => {
               try {
                    console.log("Fetching store data...");
                    const response = await fetch("/api/store");
                    if (!response.ok) {
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

                    // Only show toast in development
                    if (process.env.NODE_ENV === 'development') {
                         toast.error(`Store error: ${errorMessage}`);
                    }
               } finally {
                    setIsLoading(false);
               }
          };

          fetchStore();
     }, []);

     return (
          <StoreContext.Provider value={{ store, isLoading, error }}>
               {children}
          </StoreContext.Provider>
     );
}; 