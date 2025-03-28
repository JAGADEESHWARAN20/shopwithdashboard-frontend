const STORE_URL = `${process.env.NEXT_PUBLIC_API_URL}/storename`;

export const getStoreName = async (storeId: string): Promise<{ title: string; description: string } | null> => {
  try {
    const res = await fetch(`${STORE_URL}/${storeId}`);
    if (!res.ok) {  
      throw new Error(`Failed to fetch store name: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error getting store name:", error);
    return null;
  }
};