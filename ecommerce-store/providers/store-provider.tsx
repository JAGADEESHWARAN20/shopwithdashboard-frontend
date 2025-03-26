"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Store } from "@prisma/client";

interface StoreContextType {
     store: Store | null;
     isLoading: boolean;
     error: string | null;
}

const StoreContext = createContext<StoreContextType>({
     store: null,
     isLoading: true,
     error: null,
});

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
                    const response = await fetch("/api/store");
                    if (!response.ok) {
                         throw new Error("Failed to fetch store data");
                    }
                    const data = await response.json();
                    setStore(data);
               } catch (err) {
                    setError(err instanceof Error ? err.message : "An error occurred");
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