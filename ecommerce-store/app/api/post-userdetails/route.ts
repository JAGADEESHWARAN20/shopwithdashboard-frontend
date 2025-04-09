import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {
    const user = await currentUser();

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
                return NextResponse.json({ message: "User details sent to backend successfully!", data });
            } else {
                const errorData = await response.json(); // Parse the JSON error response
                return NextResponse.json({ error: "Failed to send user details to backend", details: errorData }, { status: response.status });
            }
        } catch (error) {
            return NextResponse.json({ error: "Error sending user details", details: error }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: "User ID or name not available." }, { status: 400 });
    }
}
