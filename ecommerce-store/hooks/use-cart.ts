import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Product } from "@/types";
import { toast } from "react-hot-toast";

interface CartStore {
     items: Product[];
     addItem: (data: Product) => void;
     removeItem: (id: string) => void;
     removeAll: () => void;
     sizeId?: string; // Store sizeId from search params
}

const useCart = create<CartStore>()(
     persist(
          (set, get) => ({
               items: [],
               sizeId: undefined,

               addItem: (data: Product) => {
                    const currentItems = get().items;
                    const existingItem = currentItems.find((item) => item.id === data.id);

                    if (existingItem) {
                         toast("Item already in cart.");
                         return;
                    }

                    set({ items: [...currentItems, data] });
                    toast.success("Item added to cart.");
               },

               removeItem: (id: string) => {
                    set((state) => ({
                         items: state.items.filter((item) => item.id !== id),
                    }));
                    toast.success("Item removed from cart.");
               },

               removeAll: () => set({ items: [] }),
          }),
          {
               name: "cart-storage",
               storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined,
          }
     )
);

// Hook to sync sizeId from searchParams into Zustand store
export const useSyncSizeId = () => {
     const searchParams = useSearchParams();
     const sizeId = searchParams.get("sizeId");
     const setSizeId = useCart((state) => state.sizeId);

     useEffect(() => {
          if (sizeId && sizeId !== setSizeId) {
               useCart.setState({ sizeId });
          }
     }, [sizeId, setSizeId]);
};

export default useCart;
