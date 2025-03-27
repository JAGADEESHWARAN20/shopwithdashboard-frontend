"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import Container from "@/components/ui/container";
import Billboard from "@/components/billboard";
import ProductList from "@/components/product-list";
import { Product } from "@/types"; // Import types

export interface Billboard {
     id: string;
     label: string;
     imageUrl: string;
}

interface HomePageProps {
     products: Product[];
     billboard: Billboard;
}

const Page: React.FC<HomePageProps> = ({ products, billboard }) => {
     const pathname = usePathname(); // Get the current pathname

     useEffect(() => {
          const sendStoreUrl = async () => {
               try {
                    // Replace with your method to get the store ID
                    const storeId = getStoreIdFromLocalStorage(); // Example using local storage
                    if (!storeId) {
                         console.error("Store ID not found.");
                         return;
                    }

                    const currentUrl = window.location.href;
                    await axios.patch("/api/update-store-url", { storeId, storeUrl: currentUrl });
                    console.log("Store URL sent to backend:", currentUrl);
               } catch (error) {
                    console.error("Failed to send store URL:", error);
               }
          };

          sendStoreUrl();
     }, [pathname]); // Run effect on pathname change

     // Example function to get store ID from local storage
     const getStoreIdFromLocalStorage = () => {
          if (typeof window !== "undefined") {
               return localStorage.getItem("storeId");
          }
          return null;
     };

     return (
          <Container>
               <div className="space-y-10 pb-10">
                    <Billboard data={billboard} />
                    <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
                         <ProductList title="Featured Products" items={products} />
                    </div>
               </div>
          </Container>
     );
};

export default Page;