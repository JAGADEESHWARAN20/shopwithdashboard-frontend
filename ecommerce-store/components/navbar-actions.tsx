"use client";

import { ShoppingBag, User } from "lucide-react";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, useUser, UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"; // Assuming Drawer components are in this path
import useCart from "@/hooks/use-cart";
import Image from 'next/image';

const NavBarActions = () => {
     const router = useRouter();
     const [isMounted, setIsMounted] = useState(false);
     const cart = useCart();
     const { isSignedIn, user } = useUser();

     useEffect(() => {
          setIsMounted(true);
     }, []);

     // Avoid rendering components that rely on client-side rendering before mount
     if (!isMounted) {
          return null;
     }

     return (
          <div className="ml-auto flex items-center pr-2 gap-x-4">
               {/* Cart Button */}
               <Button
                    onClick={() => router.push("/cart")}
                    className="rounded-full bg-black px-4 py-2 flex items-center text-white hover:bg-gray-800 transition-colors"
               >
                    <ShoppingBag size={20} className="text-white" />
                    <span className="ml-2 text-sm font-medium">{cart.items.length}</span>
               </Button>

               {isSignedIn ? (
                    // User is signed in, show profile and logout
                    <div className="flex items-center gap-x-2">
                         {user?.imageUrl && <Image src={user.imageUrl} alt="User Avatar" className="rounded-full h-8 w-8" />}
                         <span>{user?.firstName || user?.username || 'User'}</span>
                         <SignedIn>
                             <UserButton />
                         </SignedIn>
                    </div>
               ) : (
                    // User is not signed in, show sign in and sign up
                    <Drawer>
                         <DrawerTrigger asChild>
                              <Button
                                   variant="outline"
                                   size="icon"
                                   className="hover:bg-accent hover:text-accent-foreground transition-colors"
                              >
                                   <User className="h-4 w-4" />
                              </Button>
                         </DrawerTrigger>
                         <DrawerContent className="p-4">
                              <div className="flex flex-col space-y-2">
                                        <SignedOut>
                                             <SignInButton />
                                             <SignUpButton />
                                       </SignedOut>
                              </div>
                         </DrawerContent>
                    </Drawer>
               )}
          </div>
     );
};

export default NavBarActions;
