// utils/extract-domain.ts
export const extractStoreName = (url: string): string | null => {
     try {
          const parsedUrl = new URL(url);
          const host = parsedUrl.hostname; // Extract hostname
          const parts = host.split(".");

          switch (parts.length) {
               case 2:
                    // Case: `ecommercestore-online.vercel.app`
                    return "ecommercestore";
               case 3:
                    // Case: `kajol-ecommercestore-online.vercel.app`
                    if (parts[0].includes("-")) {
                         return parts[0].split("-")[0]; // Extract "kajol" from "kajol-ecommercestore"
                    }
                    return parts[0]; // Extract "kajol" from "kajol.ecommercestore"
               case 4:
                    // Case: `kajol.ecommercestore-online.vercel.app`
                    return parts[0];
               default:
                    return null;
          }
     } catch (error) {
          console.error("[ERROR] extractStoreName:", error);
          return null;
     }
};
