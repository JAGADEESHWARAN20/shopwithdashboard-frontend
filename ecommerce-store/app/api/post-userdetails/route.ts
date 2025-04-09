import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    const origin = req.headers.get("origin");

    if (!origin || !isAllowedOrigin(origin)) {
        return new NextResponse(JSON.stringify({ error: "CORS: Origin not allowed." }), {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

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
                return NextResponse.json({ message: "User details sent to backend successfully!", data }, {
                    headers: {
                        "Access-Control-Allow-Origin": origin,
                        "Access-Control-Allow-Methods": "POST, OPTIONS", // Adjust as needed
                        "Access-Control-Allow-Headers": "Content-Type, Authorization", // Adjust as needed
                    },
                });
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

// Function to check if the origin ends with the allowed domain
function isAllowedOrigin(origin: string | null): boolean {
    if (!origin) {
        return false;
    }
    return origin.endsWith("ecommercestore-online.vercel.app") || false;
}

// Handle OPTIONS request for preflight
export async function OPTIONS(req: NextRequest) {
    const origin = req.headers.get("origin");

    if (origin && isAllowedOrigin(origin)) {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "POST, OPTIONS", // Adjust as needed
                "Access-Control-Allow-Headers": "Content-Type, Authorization", // Adjust as needed
                "Access-Control-Max-Age": "86400", // Optional: How long the preflight response can be cached (in seconds)
            },
        });
    } else {
        return new NextResponse(JSON.stringify({ error: "CORS: Origin not allowed." }), {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
