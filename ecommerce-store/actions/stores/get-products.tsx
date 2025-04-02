import { Product } from "@/types";
import qs from 'query-string';

const URL = process.env.NEXT_PUBLIC_API_URL; // Base URL from env variable

interface Query {
     storeId: string; // Add storeId to the query interface
     categoryId?: string;
     colorId?: string;
     sizeId?: string;
     isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
     try {
          if (!URL) {
               throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined.");
          }

          const url = qs.stringifyUrl({
               url: `${URL}api/stores/${query.storeId}/products`, // Include storeId in the URL path
               query: {
                    sizeId: query.sizeId,
                    colorId: query.colorId,
                    categoryId: query.categoryId,
                    isFeatured: query.isFeatured,
               },
          });

          const res = await fetch(url);

          if (!res.ok) {
               // Handle HTTP errors (e.g., 404, 500)
               throw new Error(`Failed to fetch products. Status: ${res.status}`);
          }

          const data = await res.json();
          return data;
     } catch (error) {
          console.error("Error fetching products:", error);
          // Consider returning an empty array or throwing the error to be handled elsewhere
          throw error; // Rethrow the error to be caught by the caller
     }
};

export default getProducts;