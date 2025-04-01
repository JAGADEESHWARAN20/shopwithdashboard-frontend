"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import MainNav from "@/components/main-nav";
import NavBarActions from "@/components/navbar-actions";
import { getStoreName } from "@/actions/stores/get-storename";
import axios from "axios";
import { Category, StoreName } from "@/types"; // Ensure correct type import
import getCategories from "@/actions/stores/get-categories";

const Navbar = () => {
     const params = useParams(); // Get storeId from the URL
     const router = useRouter();

     const [storeId, setStoreId] = useState<string | null>(null);
     const [storeName, setStoreName] = useState<string>("Store");
     const [categories, setCategories] = useState<Category[]>([]);
     const [isMounted, setIsMounted] = useState(false);

     useEffect(() => {
          setIsMounted(true);
     }, []);

     useEffect(() => {
          if (!isMounted) return;

          const fetchStoreData = async () => {
               try {
                    let currentStoreId = params?.storeId as string | undefined;

                    if (!currentStoreId) {
                         // If no storeId in URL, fetch from getStoreName()
                         const domain = window.location.href;
                         const storeData: StoreName | null = await getStoreName(domain);

                         if (storeData && storeData.id) {
                              currentStoreId = storeData.id;
                              setStoreId(currentStoreId);
                              setStoreName(storeData.name || "Store");
                              router.push(`/`); // Redirect to store URL
                         } else {
                              console.error("[NAVBAR_STORE_ID_ERROR] Store ID not found");
                              return;
                         }
                    } else {
                         setStoreId(currentStoreId);
                    }
               } catch (error) {
                    console.error("[NAVBAR_STORE_NAME_ERROR]", error);
                    setStoreName("Store");
               }
          };

          fetchStoreData();
     }, [params?.storeId, isMounted]);

     useEffect(() => {
          if (!storeId || !isMounted) return;
          getCategories(storeId)
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
                         <Link href={`/store/${storeId}`} className="ml-2 sm:ml-2 lg:ml-4 lg:mx-0 flex gap-x-2">
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
