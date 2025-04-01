// components/StoreFront.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Store {
     id: string;
     name: string;
     storeUrl?: string;
     alternateUrls: string[];
     isActive: boolean;
}

interface StoreFrontProps {
     initialStore: Store;
}

const StoreFront: React.FC<StoreFrontProps> = ({ initialStore }) => {
     const [store, setStore] = useState<Store>(initialStore);
     const [wsStatus, setWsStatus] = useState<"Connecting" | "Connected" | "Disconnected">("Disconnected");
     const [wsMessage, setWsMessage] = useState<string>("");
     const ws = useRef<WebSocket | null>(null);

     const connectWebSocket = useCallback(() => {
          setWsStatus("Connecting");
          ws.current = new WebSocket("wss://admindashboardecom.vercel.app");

          ws.current.onopen = () => {
               setWsStatus("Connected");
          };

          ws.current.onmessage = (event) => {
               const { type, data } = JSON.parse(event.data);
               if (type === "storeUpdate" && data.storeId === store.id) {
                    setWsMessage("Store settings updated successfully");
                    setStore((prev) => ({
                         ...prev,
                         storeUrl: data.storeUrl,
                         name: data.name || prev.name,
                         alternateUrls: data.alternateUrls || prev.alternateUrls,
                    }));
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
     }, [store.id]); // Dependency on store.id

     useEffect(() => {
          connectWebSocket();

          return () => {
               if (ws.current) {
                    ws.current.close();
               }
          };
     }, [connectWebSocket]); // Depend on memoized connectWebSocket

     useEffect(() => {
          setStore(initialStore);
     }, [initialStore]);

     return (
          <div className="min-h-screen flex flex-col items-center justify-center">
               <h1 className="text-4xl font-bold mb-4">Welcome to {store.name}</h1>
               <p className="text-lg">This is your e-commerce store at {store.storeUrl}</p>
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

export default StoreFront;