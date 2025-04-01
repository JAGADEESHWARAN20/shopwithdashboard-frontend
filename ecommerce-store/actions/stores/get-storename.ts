// actions/stores/get-storename.ts (in the frontend project: kajol-ecommercestore-online.vercel.app)
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
    // Use a GET request with the name as a query parameter
    const res = await fetch(`${API_URL}/api/stores/get-id-by-name`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("[FETCH_DEBUG] GET request to:", `${API_URL}/api/stores/get-id-by-name?name=${encodeURIComponent(name)}`);
    console.log("[FETCH_DEBUG] Response status:", res.status);

    if (!res.ok) {
      throw new Error(`Failed to fetch store ID: ${res.status}`);
    }

    const data: StoreIdResponse = await res.json();
    console.log("[FETCH_DEBUG] Response data:", data);
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
    console.log("[FETCH_DEBUG] Extracted name:", name);
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