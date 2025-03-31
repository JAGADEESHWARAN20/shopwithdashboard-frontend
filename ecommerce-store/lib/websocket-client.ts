// lib/websocket-client.ts
export class WebSocketClient {
     private socket: WebSocket | null = null;
     private url: string;

     constructor(url: string) {
          this.url = url;
     }

     connect(token: string) {
          this.socket = new WebSocket(`${this.url}?token=${token}`);

          this.socket.onopen = () => {
               console.log("WebSocket connected");
          };

          this.socket.onclose = () => {
               console.log("WebSocket disconnected");
          };

          this.socket.onerror = (error) => {
               console.error("WebSocket error:", error);
          };
     }

     onMessage(callback: (data: any) => void) {
          if (this.socket) {
               this.socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    callback(data);
               };
          }
     }

     sendMessage(message: any) {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
               this.socket.send(JSON.stringify(message));
          }
     }

     disconnect() {
          if (this.socket) {
               this.socket.close();
               this.socket = null;
          }
     }
}