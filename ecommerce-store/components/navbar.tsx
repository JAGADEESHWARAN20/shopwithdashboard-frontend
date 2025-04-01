// components/navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Container from "@/components/ui/container";
import MainNav from "@/components/main-nav";
import NavBarActions from "@/components/navbar-actions";
import { getStoreName } from "@/actions/stores/get-storename";
import axios from "axios";

// Define type for Category
export interface Category {
     id: string;
     name: string;
     billboardId: string;
     storeId: string;
}

const Navbar = () => {
     const [storeId, setStoreId] = useState<string | null>(null);
     const [storeName, setStoreName] = useState<string>("Store"); // Default to "Store"
     const [categories, setCategories] = useState<Category[]>([]); // Use Category type
     const [isMounted, setIsMounted] = useState(false);

     useEffect(() => {
          setIsMounted(true);
     }, []);

     useEffect(() => {
          if (!isMounted) return;

          const fetchStoreData = async () => {
               try {
                    // Step 1: Get the current domain
                    const domain = window.location.href; // e.g., "https://kajol-ecommercestore-online.vercel.app"

                    // Step 2: Fetch store data (including storeId) using getStoreName
                    const storeData = await getStoreName(domain);
                    if (!storeData || !storeData.storeId) {
                         console.error("[NAVBAR_STORE_ID_ERROR]", "Store ID not found");
                         return;
                    }

                    setStoreId(storeData.storeId);
                    setStoreName(storeData.storeName || "Store");
               } catch (error) {
                    console.error("[NAVBAR_STORE_NAME_ERROR]", error);
                    setStoreName("Store"); // Fallback
               }
          };

          fetchStoreData();
     }, [isMounted]);

     useEffect(() => {
          if (!storeId || !isMounted) return;

          // Fetch categories using the storeId
          axios
               .get(`/api/stores/${storeId}/categories`)
               .then((response) => {
                    console.log("[NAVBAR_CATEGORIES]", response.data);
                    setCategories(response.data || []);
               })
               .catch((error) => console.error("[NAVBAR_CATEGORIES_ERROR]", error));
     }, [storeId, isMounted]);

     if (!isMounted) {
          return (
               <div className="border-b">
                    <Container>
                         <div className="relative px-4 sm:px-4 lg:px-8 flex h-16 items-center">
                              <Link href="/" className="ml-2 sm:ml-2 lg:ml-4 lg:mx-0 flex gap-x-2">
                                   <p className="text-3xl font-bold">Loading...</p>
                              </Link>
                              <MainNav data={[]} />
                              <NavBarActions />
                         </div>
                    </Container>
               </div>
          );
     }

     return (
          <div className="border-b">
               <Container>
                    <div className="relative px-4 sm:px-4 lg:px-8 flex h-16 items-center">
                         <Link href="/" className="ml-2 sm:ml-2 lg:ml-4 lg:mx-0 flex gap-x-2">
                              <p className="text-3xl font-bold">{storeName}</p>
                         </Link>
                         <MainNav data={categories} />
                         <NavBarActions />
                    </div>
               </Container>
          </div>
     );
};

export default Navbar;