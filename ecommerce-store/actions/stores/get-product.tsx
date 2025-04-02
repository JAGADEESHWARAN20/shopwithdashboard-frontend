import { Product } from "@/types";

const URL = process.env.NEXT_PUBLIC_API_URL; // Base URL from env variable

const getProduct = async (storeId: string, id: string): Promise<Product> => {
     try {
          if (!URL) {
               throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined.");
          }

          const res = await fetch(`${URL}api/stores/${storeId}/products/${id}`);

          if (!res.ok) {
               // Handle HTTP errors (e.g., 404, 500)
               throw new Error(`Failed to fetch product. Status: ${res.status}`);
          }

          const data = await res.json();
          return data;
     } catch (error) {
          console.error("Error fetching product:", error);
          // Consider returning a default product or throwing the error to be handled elsewhere
          throw error; // Rethrow the error to be caught by the caller
     }
};

export default getProduct;