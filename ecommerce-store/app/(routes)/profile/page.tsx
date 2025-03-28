// app/(routes)/profile/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getStoreIdForUser } from "@/lib/clerk"; // Your Clerk utility function

const ProfilePage = () => {
     const { user } = useUser();
     const [storeId, setStoreId] = useState<string | undefined>(undefined);

     useEffect(() => {
          const fetchStoreId = async () => {
               if (user) {
                    const id = await getStoreIdForUser(user.id);
                    setStoreId(id);
               }
          };
          fetchStoreId();
     }, [user]);

     if (!user) {
          return <div>Loading...</div>;
     }

     return (
          <div>
               <h1>Your Profile</h1>
               <p>User ID: {user.id}</p>
               <p>Name: {user.firstName} {user.lastName}</p>
               <p>Email: {user.emailAddresses[0].emailAddress}</p>
               {storeId && <p>Store ID: {storeId}</p>}
               {!storeId && <p>Store ID: Not set.</p>}
          </div>
     );
};

export default ProfilePage;