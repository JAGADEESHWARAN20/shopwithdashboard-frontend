// actions/store/get-storename.ts
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface StoreName {
  storeId: string;
  storeUrl: string;
  storeName: string;
}

export const getStoreName = async (storeId: string): Promise<StoreName | null> => {
  try {
    const res = await fetch(`${API_URL}/api/stores/${storeId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch store info: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error getting store info:", error);
    return null;
  }
};