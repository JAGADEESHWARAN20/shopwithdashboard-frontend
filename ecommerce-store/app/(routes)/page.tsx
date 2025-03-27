import getBillboards from "@/actions/get-billboards";
import getProducts from "@/actions/get-products";
import HomePage from "./HomePageClient";
import { Product, Billboard } from "@/types"; // Import types

export const revalidate = 0;

// Server Component
export default async function HomePageServer() {
     const products: Product[] = await getProducts({ isFeatured: true });
     const billboard: Billboard = await getBillboards("e697928c-5915-4361-86c3-9cc0765b6b58"); // Static billboard ID

     return <HomePage products={products} billboard={billboard} />;
}