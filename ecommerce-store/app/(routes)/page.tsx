// app/(routes)/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import  getFeaturedBillboard  from '@/actions/get-featured-billboard';
import { getStoreName } from '@/actions/get-storename';
import { Billboard as BillboardType } from '@/types'; // Import Billboard type
import Billboard from '@/components/billboard';
import ProductList from '@/components/product-list';
import { Product } from '@/types'; // Import Product type
import { getStoreId } from '@/utils/storeId'; // Import getStoreId

interface HomePageProps {
     products: Product[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
     const [billboard, setBillboard] = useState<BillboardType | null>(null);
     const [storeInfo, setStoreInfo] = useState<{ storeId: string; storeName: string } | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
          const fetchData = async () => {
               setLoading(true);
               setError(null);

               try {
                    const storeId = getStoreId();

                    if (!storeId) {
                         setError("Store ID not found.");
                         return;
                    }

                    const storeData = await getStoreName(storeId);

                    if (!storeData) {
                         setError("Store information not found.");
                         return;
                    }

                    setStoreInfo(storeData);

                    const fetchedBillboard = await getFeaturedBillboard(storeId);
                    setBillboard(fetchedBillboard);
               } catch (err) {
                    setError("Failed to fetch data.");
                    console.error("Error fetching data:", err);
               } finally {
                    setLoading(false);
               }
          };

          fetchData();
     }, []);

     if (loading) {
          return <div>Loading...</div>;
     }

     if (error) {
          return <div>Error: {error}</div>;
     }

     if (!storeInfo) {
          return <div>Store information not available.</div>;
     }

     return (
          <div>
               {billboard && <Billboard data={billboard} />}
               <ProductList title="Featured Products" items={products} />
          </div>
     );
};

export default HomePage;