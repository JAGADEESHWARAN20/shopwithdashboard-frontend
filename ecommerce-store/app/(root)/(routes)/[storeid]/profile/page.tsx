// app/(root)/(routes)/[storeId]/profile/page.tsx
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { getProfile } from "@/actions/user/get-profile";
import { UserProfile } from "@/types"; // Import centralized type

interface ProfilePageProps {
     params: { storeId: string };
}

const ProfilePage = ({ params }: ProfilePageProps) => {
     const { storeId } = params;
     const { user, isLoaded } = useUser();
     const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
     const [wsStatus, setWsStatus] = useState<"Connecting" | "Connected" | "Disconnected">("Disconnected");
     const [wsMessage, setWsMessage] = useState<string>("");
     const [error, setError] = useState<string | null>(null);
     const ws = useRef<WebSocket | null>(null);

     // Fetch user profile and set up WebSocket
     useEffect(() => {
          const fetchUserProfile = async () => {
               if (!user || !isLoaded) return;

               try {
                    const profile = await getProfile();
                    if (profile) {
                         setUserProfile(profile);
                    } else {
                         setError("Failed to fetch profile.");
                    }
               } catch (err) {
                    console.error("Error fetching profile:", err);
                    setError("An error occurred while fetching your profile.");
               }
          };

          const connectWebSocket = () => {
               if (!user || !isLoaded) return;

               setWsStatus("Connecting");
               const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "wss://admindashboardecom.vercel.app/ws/user";
               ws.current = new WebSocket(wsUrl);

               ws.current.onopen = () => {
                    setWsStatus("Connected");
                    ws.current?.send(JSON.stringify({ type: "subscribe", userId: user.id }));
               };

               ws.current.onmessage = (event) => {
                    try {
                         const { type, data } = JSON.parse(event.data);
                         if (type === "userUpdate" && data.userId === user.id) {
                              setWsMessage("Profile updated successfully");
                              if (data.storeId) {
                                   // Update storeId if needed (though not used in this page)
                              }
                              fetchUserProfile();
                         }
                    } catch (error) {
                         console.error("Error parsing WebSocket message:", error);
                    }
               };

               ws.current.onclose = () => {
                    setWsStatus("Disconnected");
                    setTimeout(connectWebSocket, 5000);
               };

               ws.current.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    setWsStatus("Disconnected");
               };
          };

          fetchUserProfile();
          connectWebSocket();

          return () => {
               if (ws.current) {
                    ws.current.close();
               }
          };
     }, [user, isLoaded]);

     if (!isLoaded || !user) {
          return <div className="text-center py-10">Loading...</div>;
     }

     if (error) {
          return <div className="text-center py-10 text-red-500">{error}</div>;
     }

     return (
          <div className="min-h-screen flex flex-col items-center justify-center">
               <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
               <p className="text-lg">User ID: {user.id}</p>
               <p className="text-lg">Name: {userProfile?.name || `${user.firstName} ${user.lastName}`}</p>
               <p className="text-lg">Email: {userProfile?.email || user.emailAddresses[0].emailAddress}</p>
               {userProfile?.phone && <p className="text-lg">Phone: {userProfile.phone}</p>}
               {userProfile?.address && <p className="text-lg">Address: {userProfile.address}</p>}
               {userProfile?.role && <p className="text-lg">Role: {userProfile.role}</p>}
               <p className="text-lg">Store ID: {storeId}</p>
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