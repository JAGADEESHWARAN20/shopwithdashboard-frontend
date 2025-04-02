import { Color } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const getColors = async (storeId: string): Promise<Color[]> => {
     const res = await fetch(`${URL}api/stores/${storeId}/colors`);

     if (!res.ok) {
          throw new Error('Failed to fetch colors');
     }

     return res.json();
};

export default getColors;