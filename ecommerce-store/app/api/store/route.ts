import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { getStoreUrl } from "@/lib/utils";

export async function GET(req: Request) {
     try {
          // Get store ID from request headers (set by middleware)
          const storeId = req.headers.get("x-store-id");
          const storeName = req.headers.get("x-store-name");
          const headerStoreUrl = req.headers.get("x-store-url");

          console.log("Store API headers:", { storeId, storeName, headerStoreUrl });

          // Local development handling
          if (storeId === 'local-dev-store-id' || storeId === 'dev-store-id') {
               console.log("Using development store data");

               // Return a dummy store for development
               return NextResponse.json({
                    id: storeId || 'dev-store-id',
                    name: storeName || 'Test Store',
                    userId: 'dev-user-id',
                    storeUrl: headerStoreUrl || getStoreUrl(storeName || 'Test Store'),
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
               });
          }

          // Production handling
          if (!storeId) {
               return new NextResponse("Store ID not found", { status: 400 });
          }

          try {
               const store = await prismadb.store.findUnique({
                    where: {
                         id: storeId,
                    },
               });

               if (!store) {
                    return new NextResponse("Store not found", { status: 404 });
               }

               // Generate dynamic store URL if it's not already set or if store name doesn't match
               if (!store.storeUrl || storeName) {
                    // Use the utility function to create dynamic store URL
                    const dynamicStoreUrl = getStoreUrl(storeName || store.name);

                    // Update the store with dynamic URL if needed
                    if (dynamicStoreUrl !== store.storeUrl) {
                         try {
                              await prismadb.store.update({
                                   where: { id: storeId },
                                   data: { storeUrl: dynamicStoreUrl }
                              });

                              store.storeUrl = dynamicStoreUrl;
                         } catch (updateError) {
                              console.error("Failed to update store URL:", updateError);
                              // Continue with the current store data
                         }
                    }
               }

               return NextResponse.json(store);
          } catch (dbError) {
               console.error("Database error:", dbError);

               // Fallback to header data if database fails
               if (storeId && storeName) {
                    return NextResponse.json({
                         id: storeId,
                         name: storeName,
                         userId: 'unknown',
                         storeUrl: headerStoreUrl || getStoreUrl(storeName),
                         isActive: true,
                         createdAt: new Date().toISOString(),
                         updatedAt: new Date().toISOString()
                    });
               }

               throw dbError; // Re-throw if we can't create fallback
          }
     } catch (error) {
          console.error("[STORE_GET]", error);
          return new NextResponse("Internal error", { status: 500 });
     }
} 