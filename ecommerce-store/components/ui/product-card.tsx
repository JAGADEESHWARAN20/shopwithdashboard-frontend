"use client"
import { MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"
import { Expand, ShoppingCart } from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import usePreviewModal from "@/hooks/use-preview-modal";
import { Product } from "@/types"
import useCart from "@/hooks/use-cart";

interface ProductCardProp {
     data: Product;
}

const ProductCard: React.FC<ProductCardProp> = ({
     data
}) => {
     const router = useRouter();
     const cart = useCart();
     const previewModal = usePreviewModal();
     const handleClick = () => {
          router.push(`/product/${data?.id}`);
     }

     const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
          event.stopPropagation();
          previewModal.onOpen(data);
     }
     const onAddtoCart: MouseEventHandler<HTMLButtonElement> = (event) => {
          event.stopPropagation();
          cart.addItem(data);
     }

     return (
          <div onClick={handleClick} className="bg-white group cursor-pointer rounded-xl border border-gray-200 hover:shadow-md transition duration-200 p-3 space-y-4">
               {/* Images and Actions */}
               <div className="aspect-square rounded-xl bg-gray-100 relative overflow-hidden">
                    <Image
                         src={data?.images?.[0]?.url}
                         fill
                         alt={data.name}
                         className="aspect-square object-cover rounded-xl hover:scale-105 transition duration-200"
                    />
                    <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
                         <div className="flex gap-x-6 justify-center">
                              <IconButton onClick={onPreview} icon={<Expand size={20} className="text-gray-600" />} />
                              <IconButton onClick={onAddtoCart} icon={<ShoppingCart size={20} className="text-gray-600" />} />
                         </div>
                    </div>
               </div>
               {/* Details */}
               <div className="space-y-1">
                    <p className="font-semibold text-lg line-clamp-1">
                         {data.name}
                    </p>
                    <p className="text-sm text-gray-500">
                         {data.category?.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                         <Currency value={data?.price} />
                    </div>
               </div>
          </div>
     )
}

export default ProductCard;
