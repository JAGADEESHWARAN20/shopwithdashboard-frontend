// actions/store/get-storename.ts
import { extractSubdomainOrDomain } from "@/utils/extract-domain";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface StoreName {
  storeId: string;
  storeUrl: string;
  storeName: string;
}

interface StoreIdResponse {
  storeId: string;
}

const getStoreIdByName = async (name: string): Promise<string | null> => {
  try {
    const res = await fetch(`${API_URL}api/stores/get-id-by-name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch store ID: ${res.status}`);
    }

    const data: StoreIdResponse = await res.json();
    return data.storeId;
  } catch (error) {
    console.error("Error fetching store ID:", error);
    return null;
  }
};

const getStoreDetails = async (storeId: string): Promise<StoreName | null> => {
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

export const getStoreName = async (url: string): Promise<StoreName | null> => {
  try {
    const name = extractSubdomainOrDomain(url);
    console.log(name)
    if (!name) {
      throw new Error("Invalid URL: Could not extract name");
    }

    const storeId = await getStoreIdByName(name);
    if (!storeId) {
      throw new Error("Could not retrieve store ID");
    }

    const storeDetails = await getStoreDetails(storeId);
    if (!storeDetails) {
      throw new Error("Could not retrieve store details");
    }

    return storeDetails;
  } catch (error) {
    console.error("Error in getStoreName:", error);
    return null;
  }
};