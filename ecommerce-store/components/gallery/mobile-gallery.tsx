"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
     Carousel,
     CarouselContent,
     CarouselItem,
     CarouselNext,
     CarouselPrevious,
} from "@/components/ui/carousal";
import Image from "next/image"; // Import Next.js Image component

interface MobileGalleryProps {
     images: string[];
}

export function MobileGallery({ images }: MobileGalleryProps) {
     const hasImages = images && images.length > 0;

     if (!hasImages) {
          return (
               <div className="w-full aspect-square relative bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No images available</span>
               </div>
          );
     }

     return (
          <div className="w-full">
               <Carousel className="w-full">
                    <CarouselContent>
                         {images.map((image, index) => (
                              <CarouselItem key={index}>
                                   <div className="p-1">
                                        <Card className="border-0 shadow-none">
                                             <CardContent className="flex aspect-square items-center justify-center p-0">
                                                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                                                       <Image
                                                            src={image}
                                                            alt={`Product image ${index + 1}`}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, 50vw"
                                                            priority={index === 0}
                                                            className="object-cover"
                                                       />
                                                  </div>
                                             </CardContent>
                                        </Card>
                                   </div>
                              </CarouselItem>
                         ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
               </Carousel>
          </div>
     );
}