"use client";

export const postUserDetails = async () => {
    try {
        const response = await fetch('/api/post-userdetails', {
            method: 'POST',
        });

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
};
