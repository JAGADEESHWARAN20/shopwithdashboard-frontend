"use client";

import { useUser } from "@clerk/nextjs";

export const postUserDetails = async () => {
     const { user } = useUser();

     if (user?.id && user?.firstName) { // Ensure user and firstName exist
          try {
               const response = await fetch(
                    "https://admindashboardecom.vercel.app/api/user-added",
                    {
                         method: "POST",
                         headers: {
                              "Content-Type": "application/json",
                         },
                         body: JSON.stringify({
                              userId: user.id, // Correctly using the Clerk User ID
                              name: user.firstName + (user.lastName ? ` ${user.lastName}` : ""), // Correctly accessing firstName and lastName
                         }),
                    }
               );

               if (response.ok) {
                    console.log("User details sent to backend successfully!");
                    // Optionally handle success (e.g., display a message)
               } else {
                    console.error("Failed to send user details to backend:", response.status);
                    // Optionally handle error (e.g., display an error message)
               }
          } catch (error) {
               console.error("Error sending user details:", error);
               // Optionally handle network error
          }
     } else {
          console.warn("User ID or name not available.");
     }
};