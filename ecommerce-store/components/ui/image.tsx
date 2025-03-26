import NextImage from 'next/image';
import { useState } from 'react';

interface ImageProps {
     src: string;
     alt: string;
     className?: string;
     width?: number;
     height?: number;
     priority?: boolean;
}

const Image = ({
     src,
     alt,
     className,
     width,
     height,
     priority = false,
}: ImageProps) => {
     const [isLoading, setLoading] = useState(true);

     return (
          <div className={`relative overflow-hidden ${className}`}>
               <NextImage
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    priority={priority}
                    className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
                    onLoadingComplete={() => setLoading(false)}
                    quality={90}
                    sizes="(max-width: 640px) 100vw,
               (max-width: 1024px) 50vw,
               33vw"
               />
          </div>
     );
};

export default Image; 