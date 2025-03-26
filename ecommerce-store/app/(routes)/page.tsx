import getFeaturedBillboard from '@/actions/get-featured-billboard'
import getProducts from '@/actions/get-products'
import Billboard from '@/components/billboard'
import ProductList from '@/components/product-list'
import Container from '@/components/ui/container'

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function HomePage() {
     // Get the featured billboard (or first available)
     const billboard = await getFeaturedBillboard();

     // Fetch featured products
     const products = await getProducts({
          isFeatured: true
     });

     return (
          <Container>
               <div className="space-y-10 py-10">
                    {billboard && <Billboard data={billboard} />}
                    <div className="flex flex-col gap-y-8 px-2 sm:px-4 lg:px-6">
                         <ProductList title="Featured Products" items={products} />
                    </div>
               </div>
          </Container>
     )
}