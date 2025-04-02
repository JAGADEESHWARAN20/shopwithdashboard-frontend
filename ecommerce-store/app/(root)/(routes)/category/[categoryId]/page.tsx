"use client"

import { notFound } from "next/navigation";
import getCategory from "@/actions/stores/get-category";
import getColors from "@/actions/stores/get-colors";
import getProducts from "@/actions/stores/get-products";
import getSizes from "@/actions/stores/get-sizes";
import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";
import Filter from "@/app/(root)/(routes)/category/components/filter";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import MobileFilters from "../components/mobile-filter";
import { getBillboard } from "@/actions/stores/get-billboards";
import { getStoreId } from "@/utils/storeId";

export const revalidate = 0;

interface Props {
     params: Promise<{ categoryId: string }>;
     searchParams?: Promise<Record<string, string | string[]>>;
}

const CategoryPage = async ({ params, searchParams }: Props) => {
     const { categoryId } = await params;

     if (!categoryId) return notFound();

     const storeId = getStoreId();

     if (!storeId) {
          return <div>Store ID not found.</div>;
     }

     const searchParamsResolved = searchParams ? await searchParams : {};
     const colorId = typeof searchParamsResolved.colorId === "string" ? searchParamsResolved.colorId : undefined;
     const sizeId = typeof searchParamsResolved.sizeId === "string" ? searchParamsResolved.sizeId : undefined;

     const [products, sizes, colors, category] = await Promise.all([
          getProducts({ storeId, categoryId, colorId, sizeId }),
          getSizes(storeId),
          getColors(storeId),
          getCategory(storeId, categoryId),
     ]);

     // Fetch billboard using billboardId
     const billboard = category?.billboardId ? await getBillboard(storeId, category.billboardId) : null;

     return (
          <div className="bg-white">
               <Container>
                    {billboard ? <Billboard data={billboard} /> : <p>Category not found</p>}
                    <div className="px-4 sm:px-6 lg:px-8 pb-24">
                         <div className="lg:grid lg:grid-cols-5 lg:gap-x-5">
                              <MobileFilters sizes={sizes} colors={colors} />
                              <div className="hidden lg:block">
                                   <Filter data={sizes} valueKey="sizeId" name="Sizes" />
                                   <Filter data={colors} valueKey="colorId" name="Colors" />
                              </div>
                              <div className="mt-6 lg:col-span-4 lg:mt-0">
                                   {products.length === 0 ? <NoResults /> : (
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                             {products.map((product) => (
                                                  <ProductCard key={product.id} data={product} />
                                             ))}
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               </Container>
          </div>
     );
};

export default CategoryPage;