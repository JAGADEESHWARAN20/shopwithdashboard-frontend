"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Container from "@/components/ui/container";
import MainNav from "@/components/main-nav";
import NavBarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";
import getStoreName from "@/actions/get-storename";
import { Category } from "@/types"; // Import Category type

const Navbar = () => {
     const params = useParams();
     const storeId = (params?.storeId as string) || process.env.NEXT_PUBLIC_STORE_ID || "";
     const [storeName, setStoreName] = useState<string | null>("Store");
     const [categories, setCategories] = useState<Category[]>([]); // Use Category type
     const [isMounted, setIsMounted] = useState(false);

     useEffect(() => {
          setIsMounted(true);
     }, []);

     useEffect(() => {
          if (storeId && isMounted) {
               getStoreName(storeId)
                    .then((name) => setStoreName(name || "Store"))
                    .catch((error) => console.error("[NAVBAR_STORE_NAME]", error));

               getCategories(storeId)
                    .then((cats) => {
                         console.log("[NAVBAR_CATEGORIES]", cats);
                         setCategories(cats || []);
                    })
                    .catch((error) => console.error("[NAVBAR_CATEGORIES_ERROR]", error));
          }
     }, [storeId, isMounted]); // storeId is used here

     if (!isMounted) {
          return (
               <div className="border-b">
                    <Container>
                         <div className="relative px-4 sm:px-4 lg:px-8 flex h-16 items-center">
                              <Link href="/" className="ml-2 sm:ml-2 lg:ml-4 lg:mx-0 flex gap-x-2">
                                   <p className="text-3xl font-bold">Store</p>
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