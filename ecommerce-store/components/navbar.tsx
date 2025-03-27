"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Container from "@/components/ui/container";
import MainNav from "@/components/main-nav";
import NavBarActions from "@/components/navbar-actions";
import axios from "axios";

// Define type for Category
export interface Category {
     id: string;
     name: string;
     billboardId: string;
     storeId: string;
}

const Navbar = () => {
     const params = useParams();
     const storeId = (params?.storeId as string) || process.env.NEXT_PUBLIC_STORE_ID || "";
     const [storeName, setStoreName] = useState<string>("Store"); // Default to "Store"
     const [categories, setCategories] = useState<Category[]>([]); // Use Category type
     const [isMounted, setIsMounted] = useState(false);

     useEffect(() => {
          setIsMounted(true);
     }, []);

     useEffect(() => {
          if (storeId && isMounted) {
               // Fetch store name
               axios
                    .get(`/api/stores/${storeId}/get-storename`)
                    .then((response) => {
                         setStoreName(response.data || "Store");
                    })
                    .catch((error) => {
                         console.error("[NAVBAR_STORE_NAME_ERROR]", error);
                         setStoreName("Store"); // Fallback
                    });

               // Fetch categories
               axios
                    .get(`/api/stores/${storeId}/categories`)
                    .then((response) => {
                         console.log("[NAVBAR_CATEGORIES]", response.data);
                         setCategories(response.data || []);
                    })
                    .catch((error) => console.error("[NAVBAR_CATEGORIES_ERROR]", error));
          }
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