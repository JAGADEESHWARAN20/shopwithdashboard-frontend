// actions/get-storename.ts

const STORE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface StoreName {
  storeId: string;
  storeUrl: string;
  storeName: string; // Add storeName to the interface
}

export const getStoreName = async (storeId: string): Promise<StoreName | null> => {
  try {
    const res = await fetch(`${STORE_URL}/stores/${storeId}`); // Make sure to use the correct API endpoint
    if (!res.ok) {
      throw new Error(`Failed to fetch store info: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error getting store info:", error);
    return null;
  }
};