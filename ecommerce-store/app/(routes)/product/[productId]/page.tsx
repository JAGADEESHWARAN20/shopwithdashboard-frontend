import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Container from "@/components/ui/container";
import ProductList from "@/components/product-list";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import { MobileGallery } from "@/components/gallery/mobile-gallery";

interface ProductPageProps {
     params: Promise<{ productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
     const { productId } = await params;

     const product = await getProduct(productId);
     const suggestedProducts = await getProducts({
          categoryId: product?.category?.id,
     });

     return (
          <div className="bg-white">
               <Container>
                    <div className="py-10">
                         <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                              {/* Mobile view - only visible on small screens */}
                              <div className="block lg:hidden w-full">
                                   <MobileGallery images={product.images.map((img) => img.url)} />
                              </div>

                              {/* Desktop view - only visible on large screens */}
                              <div className="hidden lg:block">
                                   <Gallery images={product.images} />
                              </div>

                              {/* Product information - full width on mobile, half on desktop */}
                              <div className="mt-10 sm:mt-16 lg:mt-0">
                                   <Info data={product} />
                              </div>
                         </div>

                         <hr className="my-10" />

                         {/* Related products section */}
                         <div className="mt-10">
                              <ProductList title="Related Products" items={suggestedProducts} />
                         </div>
                    </div>
               </Container>
          </div>
     );
};

export default ProductPage;
