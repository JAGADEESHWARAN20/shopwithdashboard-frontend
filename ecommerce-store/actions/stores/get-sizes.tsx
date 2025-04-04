import { Size } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const getSizes = async (storeId: string): Promise<Size[]> => {
     const res = await fetch(`${URL}api/stores/${storeId}/sizes`);

     if (!res.ok) {
          throw new Error('Failed to fetch sizes');
     }

     return res.json();
};

export default getSizes;