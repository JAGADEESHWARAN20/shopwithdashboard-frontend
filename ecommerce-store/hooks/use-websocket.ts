// hooks/use-websocket.ts
import { useEffect, useState } from "react";
import { WebSocketClient } from "@/lib/websocket-client";
import { useAuthHook } from "@/hooks/use-auth";

export const useWebSocket = () => {
     const { token } = useAuthHook();
     const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
     const [data, setData] = useState<any>(null);

     useEffect(() => {
          if (token) {
               const client = new WebSocketClient(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080");
               client.connect(token);
               setWsClient(client);

               client.onMessage((message) => {
                    setData(message);
               });

               return () => {
                    client.disconnect();
               };
          }
     }, [token]);

     const sendMessage = (message: any) => {
          if (wsClient) {
               wsClient.sendMessage(message);
          }
     };

     return { data, sendMessage };
};