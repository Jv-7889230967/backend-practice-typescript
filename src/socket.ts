import { Server } from "socket.io";


export const intializeSocket = (server: Server) => {
  return server.on("connection", async (socket) => {
    console.log(`New client connected: ${socket?.id} ${JSON.stringify(socket?.handshake)}`);

    socket.on('chatMessage', (message) => {
      console.log(`Message from ${socket.id}: ${message}`);

    });
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  })
}