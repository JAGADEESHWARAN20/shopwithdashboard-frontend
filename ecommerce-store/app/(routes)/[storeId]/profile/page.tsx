// app/(routes)/profile/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { getStoreIdForUser } from "@/lib/clerk"; // Your Clerk utility function

const ProfilePage = () => {
     const { user } = useUser();
     const [storeId, setStoreId] = useState<string | undefined>(undefined);
     const [wsStatus, setWsStatus] = useState<"Connecting" | "Connected" | "Disconnected">("Disconnected");
     const [wsMessage, setWsMessage] = useState<string>("");
     const ws = useRef<WebSocket | null>(null);

     // Fetch initial storeId and set up WebSocket
     useEffect(() => {
          const fetchStoreId = async () => {
               if (user) {
                    const id = await getStoreIdForUser(user.id);
                    setStoreId(id);
               }
          };

          const connectWebSocket = () => {
               if (!user) return; // Don't connect if user is not available

               setWsStatus("Connecting");
               ws.current = new WebSocket("wss://admindashboardecom.vercel.app/ws/user"); // Specify a path for user updates

               ws.current.onopen = () => {
                    setWsStatus("Connected");
                    // Send the userId to the WebSocket server to subscribe to updates
                    ws.current?.send(JSON.stringify({ type: "subscribe", userId: user.id }));
               };

               ws.current.onmessage = (event) => {
                    const { type, data } = JSON.parse(event.data);
                    if (type === "userUpdate" && data.userId === user.id) {
                         setWsMessage("Profile updated successfully");
                         if (data.storeId) {
                              setStoreId(data.storeId);
                         }
                    }
               };

               ws.current.onclose = () => {
                    setWsStatus("Disconnected");
                    setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
               };

               ws.current.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    setWsStatus("Disconnected");
               };
          };

          fetchStoreId();
          connectWebSocket();

          return () => {
               if (ws.current) {
                    ws.current.close();
               }
          };
     }, [user]);

     if (!user) {
          return <div>Loading...</div>;
     }

     return (
          <div className="min-h-screen flex flex-col items-center justify-center">
               <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
               <p className="text-lg">User ID: {user.id}</p>
               <p className="text-lg">Name: {user.firstName} {user.lastName}</p>
               <p className="text-lg">Email: {user.emailAddresses[0].emailAddress}</p>
               {storeId ? (
                    <p className="text-lg">Store ID: {storeId}</p>
               ) : (
                    <p className="text-lg">Store ID: Not set.</p>
               )}
               <div id="websocket-status" className="mt-4">
                    <span
                         className={`w-4 h-4 rounded-full mr-2 inline-block ${wsStatus === "Connected"
                                   ? "bg-green-500"
                                   : wsStatus === "Connecting"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                              }`}
                    ></span>
                    <span>WebSocket {wsStatus}</span>
               </div>
               {wsMessage && (
                    <div id="websocket-message" className="mt-2 p-2 bg-green-100 text-green-700">
                         {wsMessage}
                    </div>
               )}
          </div>
     );
};

export default ProfilePage;