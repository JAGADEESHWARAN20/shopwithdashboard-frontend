// app/(routes)/page.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { getBillboard, getRandomBillboardId } from '@/actions/get-billboards';
import { getStoreName } from '@/actions/get-storename';
import { Billboard } from '@/types';
import axios from 'axios';

const HomePage = () => {
     const [billboard, setBillboard] = useState<Billboard | null>(null);
     const [storeInfo, setStoreInfo] = useState<{ title: string; description: string } | null>(null);
     const [storeId, setStoreId] = useState<string | null>(null);

     useEffect(() => {
          const fetchStoreId = async () => {
               try {
                    const response = await axios.get('/api/stores');
                    if (response.data && response.data.length > 0) {
                         setStoreId(response.data[0].id);
                    }
               } catch (error) {
                    console.error("Error fetching storeId:", error);
               }
          };

          fetchStoreId();
     }, []);

     useEffect(() => {
          if (storeId) {
               const fetchBillboard = async () => {
                    const randomId = await getRandomBillboardId();
                    if (randomId) {
                         const fetchedBillboard = await getBillboard(randomId);
                         setBillboard(fetchedBillboard);
                    }
               };

               const fetchStoreName = async () => {
                    const fetchedStoreInfo = await getStoreName(storeId);
                    setStoreInfo(fetchedStoreInfo);
               };

               fetchBillboard();
               fetchStoreName();
          }
     }, [storeId]);

     if (!billboard || !storeInfo) {
          return <div>Loading...</div>;
     }

     return (
          <div>
               <h1>{storeInfo.title}</h1>
               <p>{storeInfo.description}</p>
               {billboard && (
                    <div>
                         <h2>{billboard.label}</h2>
                         <img src={billboard.imageUrl} alt="Billboard" />
                    </div>
               )}
          </div>
     );
};

export default HomePage;