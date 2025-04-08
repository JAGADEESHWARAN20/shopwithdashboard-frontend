"use client";

import { useUser } from "@clerk/nextjs";

export const postUserDetails = async () => {
     const { user } = useUser();

     if (user?.id && user?.firstName && user?.emailAddresses?.[0]?.emailAddress) {
          try {
               const response = await fetch(
                    "https://admindashboardecom.vercel.app/api/user-added",
                    {
                         method: "POST",
                         headers: {
                              "Content-Type": "application/json",
                         },
                         body: JSON.stringify({
                              userId: user.id,
                              name: user.firstName + (user.lastName ? ` ${user.lastName}` : ""),
                              email: user.emailAddresses[0].emailAddress,
                         }),
                    }
               );

               if (response.ok) {
                    const data = await response.json(); // Parse the JSON response
                    console.log("User details sent to backend successfully!", data);
                    // Optionally handle success (e.g., display a message, redirect)
               } else {
                    const errorData = await response.json(); // Parse the JSON error response
                    console.error("Failed to send user details to backend:", response.status, errorData);
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