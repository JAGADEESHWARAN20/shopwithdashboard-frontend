"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const UserProfilePage = () => {
     const { isSignedIn, user } = useUser();

     useEffect(() => {
          if (isSignedIn && user) {
               console.log("Clerk User ID:", user.id);
               console.log("User Object:", user);

               // Access Google-specific information through externalAccounts
               const googleAccount = user.externalAccounts?.find(
                    (account) => account.provider
               );

               if (googleAccount) {
                    console.log("Google Account Data:", googleAccount);
                    console.log("Google Email:", googleAccount.emailAddress);
                    // You can access other Google profile information here,
                    // depending on what Clerk returns in this object.
               }
          }
     }, [isSignedIn, user]);

     if (!isSignedIn) {
          return <p>Not signed in.</p>;
     }

     return (
          <div>
               <h1>User Profile</h1>
               <p>Clerk User ID: {user?.id}</p>
               {/* Display other user information */}
               {user?.externalAccounts?.map((account) => (
                    <div key={account.id}>
                         <p>Provider: {account.provider}</p>
                         <p>Email: {account.emailAddress}</p>
                         {/* Display other relevant account details */}
                    </div>
               ))}
          </div>
     );
};

export default UserProfilePage;