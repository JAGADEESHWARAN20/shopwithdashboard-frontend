"use client";

import Link from 'next/link'
import { useEffect, useState } from 'react';
import Container from "@/components/ui/container";
import MainNav from "@/components/main-nav"
import NavBarActions from "@/components/navbar-actions"
import { Category } from "@/types";
import { useStore } from '@/providers/store-provider';
import { RefreshCw } from 'lucide-react';

const Navbar = () => {
     const [categories, setCategories] = useState<Category[]>([]);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const { store, isLoading: storeLoading, error: storeError, retryFetch } = useStore();

     const fetchCategories = async () => {
          try {
               setIsLoading(true);
               setError(null);
               const response = await fetch('/api/categories', {
                    cache: "no-cache",
                    headers: {
                         'Cache-Control': 'no-cache',
                         'Pragma': 'no-cache'
                    }
               });

               if (!response.ok) {
                    throw new Error(`Failed to fetch categories: ${response.status}`);
               }

               const data = await response.json();
               // Only show categories that exist in the database
               setCategories(data);
          } catch (err) {
               console.error('Error fetching categories:', err);
               setError(err instanceof Error ? err.message : 'Error loading categories');

               // Use fallback empty categories - don't show anything that doesn't exist
               setCategories([]);
          } finally {
               setIsLoading(false);
          }
     };

     useEffect(() => {
          fetchCategories();
     }, []);

     const handleRetry = () => {
          retryFetch();
          fetchCategories();
     };

     if (isLoading || storeLoading) {
          return (
               <div className="border-b">
                    <Container>
                         <div className='relative px-4 sm:px-4 lg:px-8 flex h-16 items-center'>
                              <p className='text-3xl font-bold'>Loading...</p>
                         </div>
                    </Container>
               </div>
          );
     }

     const hasError = error || storeError;

     return (
          <div className="border-b">
               <Container>
                    <div className='relative px-4 sm:px-4 lg:px-8 flex h-16 items-center'>
                         <Link href={'/'} className="ml-2 sm:ml-2 lg:ml-4 lg:mx-0 flex gap-x-2">
                              <p className='text-3xl font-bold'>{store?.name || 'Store'}</p>
                         </Link>
                         {hasError && (
                              <button
                                   onClick={handleRetry}
                                   className="ml-4 text-sm flex items-center text-red-500 hover:text-red-700"
                              >
                                   <RefreshCw className="h-4 w-4 mr-1" />
                                   Retry
                              </button>
                         )}
                         {categories.length > 0 && <MainNav data={categories} />}
                         <NavBarActions />
                    </div>
               </Container>
          </div>
     );
};

export default Navbar;

// "use client";
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import Container from "@/components/ui/container";
// import MainNav from "@/components/main-nav";
// import NavBarActions from "@/components/navbar-actions";
// import getCategories from '@/actions/get-categories';
// import { Category } from "@/types";

// const Navbar = () => {
//      const [categories, setCategories] = useState<Category[]>([]);

//      useEffect(() => {
//           // Immediately-invoked async function within useEffect
//           (async () => {
//                try {
//                     const cats = await getCategories();
//                     setCategories(cats);
//                } catch (error) {
//                     console.error("Failed to fetch categories:", error);
//                }
//           })();
//      }, []);

//      return (
//           <div className="border-b">
//                <Container>
//                     <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
//                          <Link href={'/'} className="ml-4 lg:mx-0 flex gap-x-2">
//                               <p className="text-3xl font-bold">Store</p>
//                          </Link>
//                          <MainNav data={categories} />
//                          <NavBarActions />
//                     </div>
//                </Container>
//           </div>
//      );
// };

// export default Navbar;
