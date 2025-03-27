"use client";

import { Store } from "@/types";

const getStoreName = async (storeId: string): Promise<string | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/stores/${storeId}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch store: ${res.status} ${res.statusText}`);
    }

    const store: Store = await res.json();
    return store?.name || null;
  } catch (error) {
    console.error("[GET_STORE_NAME]", error);
    return null;
  }
};

export default getStoreName;