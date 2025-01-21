import { Server, Socket } from "socket.io";
import { activeUsers } from "./utils/TemporaryStorage";
import { getCurrentUser } from "./services/shared/getCurrentUser";
import { jwtUser } from "../types/jwt";

export const initializeSocket = (io: Server) => { // Accept a `Server` instance
    
    io.on("connection", (socket: Socket) => { // Handle new connections
        const userRoom = `user_${socket.id}`;
        socket.join(userRoom);
        const auth_token: string | string[] | undefined = socket?.handshake?.headers?.authentication;
        const currentUser: jwtUser | null = getCurrentUser(auth_token);
        if (currentUser?.username) {
            activeUsers.set(currentUser.username, userRoom);
            console.log("New user connected-currently active users", activeUsers);
        } else {
            console.log("Failed to get current user");
        }

        socket.on("privateMessage", ({ messageTo, message, senderName }) => {
            const messageto: string | undefined = activeUsers.get(messageTo);
            console.log("message to room", messageto);
            if (messageto) {
                console.log(`Sending message to room: ${messageto}`);
                socket.to(messageto).emit("messageEvent", {
                    from: senderName,
                    message: message
                });
                console.log("Entered private message function");
            } else {
                console.log(`User ${messageTo} not found in active users`);
            }
        });

        socket.on("messageEvent", ({ from, message }) => {
            console.log("Entered message event");
            console.log("New message from ", {
                from: from,
                message: message
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
            if (currentUser?.username) {
                activeUsers.delete(currentUser.username);
                console.log("Updated active users", activeUsers);
            }
        });
    });
};