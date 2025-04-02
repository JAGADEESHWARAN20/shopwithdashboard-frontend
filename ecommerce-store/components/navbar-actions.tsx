"use client";

import { ShoppingBag, User } from "lucide-react";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs"; // Using Clerk authentication

const NavBarActions = () => {
     const router = useRouter();
     const [isMounted, setIsMounted] = useState(false);
     const cart = useCart();
     const { isSignedIn } = useAuth(); // Get auth status

     useEffect(() => {
          setIsMounted(true);
     }, []);

     if (!isMounted) {
          return null;
     }

     return (
          <div className="ml-auto flex items-center pr-2 gap-x-4">
               {/* Cart Button */}
               <Button
                    onClick={() => router.push("/cart")}
                    className="bg-black px-4 py-2 flex items-center rounded-full"
               >
                    <ShoppingBag size={20} color="white" />
                    <span className="ml-2 text-sm font-medium text-white">{cart.items.length}</span>
               </Button>

               {/* Profile Button - Redirects only if user is not signed in */}
               <Button
                    onClick={() => {
                         if (!isSignedIn) {
                              router.push("/sign-in");
                         }
                    }}
                    className="bg-gray-200 px-4 py-2 flex items-center rounded-full text-black"
               >
                    <User size={20} className="mr-2" />
                    {isSignedIn ? "Profile" : "Sign In"}
               </Button>

               {/* Sign Up Button - Always redirects */}
               <Button
                    onClick={() => router.push("/sign-up")}
                    className="bg-blue-500 px-4 py-2 text-white rounded-full"
               >
                    Sign Up
               </Button>
          </div>
     );
};

export default NavBarActions;
