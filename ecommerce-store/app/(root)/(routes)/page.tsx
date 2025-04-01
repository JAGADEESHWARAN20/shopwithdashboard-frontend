// app/(root)/(routes)/page.tsx
import getFeaturedBillboard from "@/actions/stores/get-featured-billboard";
import { getStoreName } from "@/actions/stores/get-storename";
import getProducts from "@/actions/stores/get-products";
import Billboard from "@/components/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";
import { Billboard as BillboardType, Product } from "@/types";

const HomePage = async () => {
     try {
          // Step 1: Determine the current domain
          const domain = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

          // Step 2: Fetch store data (including storeId) using getStoreName
          const storeData = await getStoreName(domain);
          if (!storeData || !storeData.id) {  // Changed from storeData.storeId to storeData.id
               return (
                    <Container>
                         <div className="px-4 py-10 sm:px-6 lg:px-8">
                              <div className="text-center py-10">Store information not found.</div>
                         </div>
                    </Container>
               );
          }

          const storeId = storeData.id; // Fix: Use storeData.id

          // Step 3: Fetch billboard and products using the storeId
          const billboard = await getFeaturedBillboard(storeId);
          const products = await getProducts({ storeId });

          return (
               <Container>
                    <div className="px-4 py-10 sm:px-6 lg:px-8">
                         {billboard ? (
                              <Billboard data={billboard as BillboardType} />
                         ) : (
                              <div className="text-center py-10">No featured billboard available.</div>
                         )}
                         <ProductList title="Featured Products" items={products as Product[]} />
                    </div>
               </Container>
          );
     } catch (error) {
          console.error("Error fetching data:", error);
          return (
               <Container>
                    <div className="px-4 py-10 sm:px-6 lg:px-8">
                         <div className="text-center py-10 text-red-500">
                              Failed to fetch data. Please try again later.
                         </div>
                    </div>
               </Container>
          );
     }
};
export default HomePage;