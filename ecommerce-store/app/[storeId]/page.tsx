import Navbar from "@/components/navbar";
import getCategories from "@/actions/get-categories";
import getStoreName from "@/actions/get-storename";

export default async function StorePage({ params }: { params: { storeId: string } }) {
     const storeId = params.storeId;
     const categories = await getCategories(storeId);
     const storeName = await getStoreName(storeId);

     return (
          <div>
               <Navbar storeId={storeId} categories={categories} storeName={storeName} />
               <main>{/* Page content */}</main>
          </div>
     );
}