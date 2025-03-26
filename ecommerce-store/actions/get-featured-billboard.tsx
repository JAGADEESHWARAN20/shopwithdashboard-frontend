import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

// Get the first featured billboard for homepage
const getFeaturedBillboard = async (): Promise<Billboard | null> => {
     try {
          // First try to get one marked as featured
          const res = await fetch(`${URL}?featured=true`);

          if (!res.ok) {
               // If that fails, get all billboards
               const allRes = await fetch(`${URL}`);
               if (!allRes.ok) return null;

               const billboards = await allRes.json();
               // Return the first one if available
               return billboards.length > 0 ? billboards[0] : null;
          }

          const featuredBillboards = await res.json();
          return featuredBillboards.length > 0 ? featuredBillboards[0] : null;
     } catch (error) {
          console.error('Error fetching featured billboard:', error);
          return null;
     }
}

export default getFeaturedBillboard; 