import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// Force dynamic rendering to avoid static generation errors with headers
export const dynamic = 'force-dynamic';

export async function GET(
  req: Request
) {
  try {
    // Get store ID from headers
    const storeId = req.headers.get('x-store-id');

    // Check if we have the store ID
    if (!storeId) {
      console.log("No store ID found in headers");

      // For development, return dummy categories
      if (process.env.NODE_ENV === 'development') {
        console.log("Returning development categories");
        return NextResponse.json([
          { id: "dev-cat-1", name: "Clothing", storeId: "dev-store" },
          { id: "dev-cat-2", name: "Electronics", storeId: "dev-store" },
          { id: "dev-cat-3", name: "Books", storeId: "dev-store" },
        ]);
      }

      return new NextResponse("Store ID is required", { status: 400 });
    }

    // For local development or default store
    if (storeId === 'local-dev-store-id' || storeId === 'dev-store-id' || storeId === 'default-store-id') {
      console.log(`Returning default categories for store ID: ${storeId}`);
      return NextResponse.json([
        { id: "default-cat-1", name: "Clothing", storeId: storeId },
        { id: "default-cat-2", name: "Electronics", storeId: storeId },
        { id: "default-cat-3", name: "Books", storeId: storeId },
        { id: "default-cat-4", name: "Home & Kitchen", storeId: storeId },
      ]);
    }

    // Get the categories for this store
    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
      include: {
        billboard: true,
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 