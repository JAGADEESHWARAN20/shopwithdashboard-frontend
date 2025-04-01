// actions/stores/get-storename.ts
import { extractStoreName } from "@/utils/extract-domain";

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
    const url = `${API_URL}/api/stores/get-id-by-name?name=${encodeURIComponent(name)}`;
    console.log("[FETCH_DEBUG] GET request to:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("[FETCH_DEBUG] Response status:", res.status);

    if (!res.ok) {
      throw new Error(`Failed to fetch store ID: ${res.status}`);
    }

    const data: StoreIdResponse = await res.json();
    console.log("[FETCH_DEBUG] Response data:", data);
    return data.storeId;
  } catch (error) {
    console.error("[ERROR] Error fetching store ID:", error);
    return null;
  }
};

const getStoreDetails = async (storeId: string): Promise<StoreName | null> => {
  try {
    const url = `${API_URL}/api/stores/${storeId}`;
    console.log("[FETCH_DEBUG] Fetching store details from:", url);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch store info: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("[ERROR] Error getting store info:", error);
    return null;
  }
};

export const getStoreName = async (url: string): Promise<StoreName | null> => {
  try {
    const name = extractStoreName(url);
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
    console.error("[ERROR] in getStoreName:", error);
    return null;
  }
};
