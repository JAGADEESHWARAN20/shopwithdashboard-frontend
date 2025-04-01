// utils/extract-domain.ts
export const extractSubdomainOrDomain = (url: string): string => {
     let domain = ''; // Declare domain outside the try block
     try {
          domain = url.replace(/^https?:\/\//, ''); // Assign value to domain
          const parts = domain.split('.');
          if (parts.length > 2) {
               return parts[0]; // Return subdomain (e.g., "kajol" from "kajol-ecommercestore-online.vercel.app")
          }
          return domain; // Return full domain if no subdomain (e.g., "ecommercestore-online.vercel.app")
     } catch (error) {
          console.error("Error extracting subdomain or domain:", error);
          return domain || url; // Fallback to the original URL if domain is empty
     }
};