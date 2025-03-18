import { notFound } from "next/navigation";
import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";
import Filter from "@/app/(routes)/category/components/filter";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import MobileFilters from "../components/mobile-filter";

export const revalidate = 0;

interface Props {
     params: Promise<{ categoryId: string }>;
     searchParams?: Promise<Record<string, string | string[]>>;
}

const CategoryPage = async ({ params, searchParams }: Props) => {
     const { categoryId } = await params;

     if (!categoryId) return notFound();

     const searchParamsResolved = searchParams ? await searchParams : {};
     const colorId = typeof searchParamsResolved.colorId === "string" ? searchParamsResolved.colorId : undefined;
     const sizeId = typeof searchParamsResolved.sizeId === "string" ? searchParamsResolved.sizeId : undefined;

     const [products, sizes, colors, category] = await Promise.all([
          getProducts({ categoryId, colorId, sizeId }),
          getSizes(),
          getColors(),
          getCategory(categoryId),
     ]);

     return (
          <div className="bg-white">
               <Container>
                    {category ? <Billboard data={category.billboard} /> : <p>Category not found</p>}
                    <div className="px-4 sm:px-6 lg:px-8 pb-24">
                         <div className="lg:grid lg:grid-cols-5 lg:gap-x-5">
                              <MobileFilters sizes={sizes} colors={colors} />
                              <div className="hidden lg:block">
                                   <Filter data={sizes} valueKey="sizeId" name="Sizes" />
                                   <Filter data={colors} valueKey="colorId" name="Colors" />
                              </div>
                              <div className="mt-6 lg:col-span-4 lg:mt-0">
                                   {products.length === 0 ? (
                                        <NoResults />
                                   ) : (
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
