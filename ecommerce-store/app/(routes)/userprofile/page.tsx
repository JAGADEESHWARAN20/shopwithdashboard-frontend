"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const UserProfilePage = () => {
     const { isSignedIn, user } = useUser();

     useEffect(() => {
          if (isSignedIn && user) {
               console.log("Clerk User ID:", user.id);
               console.log("User Object:", user);

               const googleAccount = user.externalAccounts?.find(
                    (account) => account.provider === "google"
               );

               if (googleAccount) {
                    console.log("Google Account Data:", googleAccount);
                    console.log("Google Email:", googleAccount.emailAddress);
               }
          }
     }, [isSignedIn, user]);

     if (!isSignedIn || !user) {
          return <p>Not signed in.</p>;
     }

     return (
          <div className="p-6">
               <h1 className="text-2xl font-bold mb-4">User Profile</h1>

               <div className="space-y-2">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Primary Email:</strong> {
                         user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress
                    }</p>
                    <p><strong>Image URL:</strong> <a href={user.imageUrl} target="_blank" className="text-blue-600 underline">View</a></p>
                    <p><strong>Last Sign-In At:</strong> {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'N/A'}</p>
                    <p><strong>Last Sign-In At:</strong> {new Date(user.lastSignInAt ?? '').toLocaleString()}</p>
               </div>

               <hr className="my-4" />

               <h2 className="text-xl font-semibold mb-2">External Accounts</h2>
               {user.externalAccounts?.length > 0 ? (
                    user.externalAccounts.map((account) => (
                         <div key={account.id} className="mb-4 border p-4 rounded bg-gray-50">
                              <p><strong>Provider:</strong> {account.provider}</p>
                              <p><strong>Email:</strong> {account.emailAddress}</p>
                              <p><strong>Approved Scopes:</strong> {account.approvedScopes}</p>
                              <p><strong>Provider User ID:</strong> {account.providerUserId}</p>
                              {/* Add more fields if needed */}
                         </div>
                    ))
               ) : (
                    <p>No external accounts connected.</p>
               )}
          </div>
     );
};

export default UserProfilePage;
