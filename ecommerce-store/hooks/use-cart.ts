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
     sizeId?: string;
     setSizeId: (sizeId: string | undefined) => void; // ✅ Add setter function
}

const useCart = create(
     persist<CartStore>(
          (set, get) => ({
               items: [],
               addItem: (data: Product) => {
                    const currentItems = get().items;
                    if (currentItems.some((item) => item.id === data.id)) {
                         toast("Item already in cart.");
                         return;
                    }

                    set({ items: [...currentItems, data] });
                    toast.success("Item added to cart.");
               },
               removeItem: (id: string) => {
                    set({ items: get().items.filter((item) => item.id !== id) });
                    toast.success("Item removed from cart.");
               },
               removeAll: () => set({ items: [] }),
               sizeId: undefined, // ✅ Default state
               setSizeId: (sizeId) => set({ sizeId }), // ✅ Setter function for sizeId
          }),
          {
               name: "cart-storage",
               storage: createJSONStorage(() =>
                    typeof window !== "undefined"
                         ? localStorage
                         : {
                              getItem: () => null, // ✅ Dummy storage for SSR
                              setItem: () => { }, // ✅ Avoids SSR errors
                              removeItem: () => { },
                         }
               ), // ✅ Fix localStorage issue in SSR
          }
     )
);

// ✅ Hook to sync sizeId from searchParams into Zustand store
export const useSyncSizeId = () => {
     const searchParams = useSearchParams();
     const sizeId = searchParams.get("sizeId");
     const setSizeId = useCart((state) => state.setSizeId); // ✅ Get setter function from Zustand

     useEffect(() => {
          setSizeId(sizeId || undefined); // ✅ Update Zustand store safely
     }, [sizeId, setSizeId]);
};

export default useCart;
