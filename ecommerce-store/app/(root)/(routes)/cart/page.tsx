// app/(root)/(routes)/cart/page.tsx
"use client";

import { Suspense } from "react";
import Container from "@/components/ui/container";
import  useCart  from "@/hooks/use-cart"; // Fixed import
import CartItems from "./components/cart-items";
import Summary from "./components/summary";
import { Product } from "@/types";

const CartPage = () => {
     const cart = useCart();

     return (
          <div className="bg-white">
               <Container>
                    <div className="px-4 py-16 sm:px-6 lg:px-8">
                         <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
                         <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                              <div className="lg:col-span-7">
                                   {cart.items.length === 0 && (
                                        <p className="text-neutral-500 lg:col-span-7 text-center">
                                             No Items Added to Cart
                                        </p>
                                   )}
                                   <ul>
                                        <Suspense fallback={<div className="text-center py-4">Loading cart items...</div>}>
                                             {cart.items.map((item: Product) => (
                                                  <CartItems key={item.id} data={item} />
                                             ))}
                                        </Suspense>
                                   </ul>
                              </div>
                              <Suspense fallback={<div className="text-center py-4">Loading summary...</div>}>
                                   <Summary />
                              </Suspense>
                         </div>
                    </div>
               </Container>
          </div>
     );
};

export default CartPage;