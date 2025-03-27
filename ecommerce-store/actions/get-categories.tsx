"use client";

import { Category } from "@/types";

const getCategories = async (storeId: string): Promise<Category[]> => {
     const url = `${process.env.NEXT_PUBLIC_API_URL}/stores/${storeId}/categories`;

     try {
          const res = await fetch(url, {
               method: "GET",
               headers: {
                    "Content-Type": "application/json",
               },
          });

          if (!res.ok) {
               throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
          }

          const categories: Category[] = await res.json();
          return categories;
     } catch (error) {
          console.error("[GET_CATEGORIES]", error);
          return [];
     }
};

export default getCategories;