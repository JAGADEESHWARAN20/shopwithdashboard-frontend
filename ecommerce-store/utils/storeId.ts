
"use client";

import { useParams } from 'next/navigation';

export const getStoreId = (): string | null => {
     const params = useParams();
     const storeIdFromParams = params.storeId as string;

     if (storeIdFromParams) {
          localStorage.setItem('storeId', storeIdFromParams);
          return storeIdFromParams;
     }

     return localStorage.getItem('storeId');
};