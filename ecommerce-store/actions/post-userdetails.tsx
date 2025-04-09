"use client";

export const postUserDetails = async () => {
    try {
        const domain = window.location.origin;

        const response = await fetch(`${domain}/api/post-userdetails`, {
            method: 'POST',
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (response.ok) {
            console.log("User details sent to backend successfully!", data);
        } else {
            console.error("Failed to send user details:", response.status, data);
        }
    } catch (error) {
        console.error("Error sending user details:", error);
    }
};
