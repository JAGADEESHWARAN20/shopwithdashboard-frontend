import { Billboard } from "@/types";

export const getBillboard = async (storeId: string, id: string): Promise<Billboard> => {
     try {
          if (!process.env.NEXT_PUBLIC_API_URL) {
               throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined.");
          }

          const URL = `${process.env.NEXT_PUBLIC_API_URL}api/stores/${storeId}/billboards/${id}`;
          const res = await fetch(URL);

          if (!res.ok) {
               throw new Error(`Failed to fetch billboard: ${res.status}`);
          }

          return res.json();
     } catch (error) {
          console.error("Error getting billboard:", error);
          throw error;
     }
};

export const getRandomBillboardId = async (storeId: string): Promise<string | null> => {
     try {
          if (!process.env.NEXT_PUBLIC_API_URL) {
               throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined.");
          }

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeId}/billboards`);

          if (!res.ok) {
               throw new Error(`Failed to fetch billboard IDs: ${res.status}`);
          }

          const billboards: Billboard[] = await res.json();

          if (billboards && billboards.length > 0) {
               const ids: string[] = billboards.map((billboard) => billboard.id);
               const randomIndex = Math.floor(Math.random() * ids.length);
               return ids[randomIndex];
          }

          return null;
     } catch (error) {
          console.error("Error getting random billboard ID:", error);
          return null;
     }
};