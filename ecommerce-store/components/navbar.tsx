import Link from "next/link";
import Container from "@/components/ui/container";
import MainNav from "@/components/main-nav";
import NavBarActions from "@/components/navbar-actions";

interface NavbarProps {
     storeId?: string; // Optional for static use
     categories?: any[]; // Optional, replace with Category[] if typed
     storeName?: string | null; // Optional
}

const Navbar = ({ storeId, categories = [], storeName }: NavbarProps) => {
     return (
          <div className="border-b">
               <Container>
                    <div className="relative px-4 sm:px-4 lg:px-8 flex h-16 items-center">
                         <Link href="/" className="ml-2 sm:ml-2 lg:ml-4 lg:mx-0 flex gap-x-2">
                              <p className="text-3xl font-bold">{storeName || "Store"}</p>
                         </Link>
                         <MainNav data={categories} />
                         <NavBarActions />
                    </div>
               </Container>
          </div>
     );
};

export default Navbar;