"use client"

import Image from "next/image";
import { TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Image as ImageType } from "@/types"
import GalleryTab from "./gallery-tab";

interface galleryProps {
     images: ImageType[];
}

const Gallery: React.FC<galleryProps> = ({
     images
}) => {
     // Use first image as fallback if no images are provided
     const hasImages = images && images.length > 0;

     return (
          <TabGroup as="div" className="flex flex-col-reverse">
               {/* Image thumbnails */}
               <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
                    <TabList className="grid grid-cols-4 gap-4">
                         {hasImages ? (
                              images.map((image) => (
                                   <GalleryTab key={image.id} image={image} />
                              ))
                         ) : (
                              <div className="relative aspect-square h-full w-full overflow-hidden rounded-md">
                                   <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No image</span>
                                   </div>
                              </div>
                         )}
                    </TabList>
               </div>

               {/* Main image display */}
               <TabPanels className="aspect-square w-full">
                    {hasImages ? (
                         images.map((image) => (
                              <TabPanel key={image.id}>
                                   <div className="aspect-square relative h-full w-full overflow-hidden rounded-lg">
                                        <Image
                                             fill
                                             src={image.url}
                                             alt="Product image"
                                             className="object-cover object-center"
                                             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                             priority={images.indexOf(image) === 0}
                                        />
                                   </div>
                              </TabPanel>
                         ))
                    ) : (
                         <TabPanel>
                              <div className="aspect-square relative h-full w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                                   <span className="text-gray-400">No image available</span>
                              </div>
                         </TabPanel>
                    )}
               </TabPanels>
          </TabGroup>
     )
}

export default Gallery;