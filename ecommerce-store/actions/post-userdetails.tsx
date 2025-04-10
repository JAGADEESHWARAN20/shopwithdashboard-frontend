// // app/api/post-userdetails/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { currentUser } from "@clerk/nextjs/server";

// // Allow-list of origins
// const allowedOrigins = [
//     "https://ecommercestore-online.vercel.app",
//     "https://kajol-ecommercestore-online.vercel.app",
// ];

// function isAllowedOrigin(origin: string | null): boolean {
//     return origin !== null && allowedOrigins.includes(origin);
// }

// export async function POST(req: NextRequest) {
//     const origin = req.headers.get("origin");

//     if (!isAllowedOrigin(origin)) {
//         return new NextResponse(JSON.stringify({ error: "CORS: Origin not allowed." }), {
//             status: 403,
//             headers: {
//                 "Content-Type": "application/json",
//                 "Access-Control-Allow-Origin": origin ?? "*",
//             },
//         });
//     }

//     const user = await currentUser();

//     if (user?.id && user?.firstName && user?.emailAddresses?.[0]?.emailAddress) {
//         try {
//             const response = await fetch("https://admindashboardecom.vercel.app/api/user-added", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({  
//                     userId: user.id,
//                     name: user.firstName + (user.lastName ? ` ${user.lastName}` : ""),
//                     email: user.emailAddresses[0].emailAddress,
//                 }),
//             });

//             const text = await response.text();
//             const data = text ? JSON.parse(text) : {};

//             if (response.ok) {
//                 return NextResponse.json(
//                     { message: "User details sent to backend successfully!", data },
//                     {
//                         headers: {
//                             "Access-Control-Allow-Origin": origin ?? "*",
//                             "Access-Control-Allow-Methods": "POST, OPTIONS",
//                             "Access-Control-Allow-Headers": "Content-Type, Authorization",
//                         },
//                     }
//                 );
//             } else {
//                 return NextResponse.json(
//                     { error: "Failed to send user details to backend", details: data },
//                     { status: response.status }
//                 );
//             }
//         } catch (error) {
//             return NextResponse.json(
//                 { error: "Error sending user details", details: error },
//                 { status: 500 }
//             );
//         }
//     } else {
//         return NextResponse.json(
//             { error: "User ID or name not available." },
//             { status: 400 }
//         );
//     }
// }

// export async function OPTIONS(req: NextRequest) {
//     const origin = req.headers.get("origin");

//     if (!isAllowedOrigin(origin)) {
//         return new NextResponse(JSON.stringify({ error: "CORS: Origin not allowed." }), {
//             status: 403,
//             headers: {
//                 "Content-Type": "application/json",
//                 "Access-Control-Allow-Origin": origin ?? "*",
//             },
//         });
//     }

//     return new NextResponse(null, {
//         status: 204,
//         headers: {
//             "Access-Control-Allow-Origin": origin ?? "*",
//             "Access-Control-Allow-Methods": "POST, OPTIONS",
//             "Access-Control-Allow-Headers": "Content-Type, Authorization",
//             "Access-Control-Max-Age": "86400",
//         },
//     });
// }
