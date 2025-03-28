import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

export const getBillboard = async (id: string): Promise<Billboard> => {
     const res = await fetch(`${URL}/${id}`);
     if (!res.ok) {
          throw new Error(`Failed to fetch billboard: ${res.status}`);
     }
     return res.json();
};

export const getRandomBillboardId = async (): Promise<string | null> => {
     try {
          const res = await fetch(`${URL}/ids`); // Assuming you have an endpoint to get all billboard IDs
          if (!res.ok) {
               throw new Error(`Failed to fetch billboard IDs: ${res.status}`);
          }
          const ids: string[] = await res.json();
          if (ids && ids.length > 0) {
               const randomIndex = Math.floor(Math.random() * ids.length);
               return ids[randomIndex];
          }
          return null; // Return null if there are no billboard IDs
     } catch (error) {
          console.error("Error getting random billboard ID:", error);
          return null;
     }
};