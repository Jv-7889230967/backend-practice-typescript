import { Server, Socket } from "socket.io";
import { Request } from "express";
import { activeUsers } from "./utils/TemporaryStorage.js";
import { getCurrentUser } from "./services/shared/getCurrentUser.js";
import { jwtUser } from "../types/jwt.d.js";
import { UserType } from "../types/user.js";
import { User } from "./models/auth/UserModels.js";

interface authenticatedSocket extends Socket {
    user?: UserType | null;
}

export const initializeSocket = (io: Server) => { // Accept a `Server` instance

    io.on("connection", async (socket: authenticatedSocket) => { // Handle new connections
        const auth_token: string | string[] | undefined = socket?.handshake?.headers?.authentication;
        const currentUser: jwtUser | null = getCurrentUser(auth_token);
        if (currentUser?.username) {
            const user: UserType | null = await User.findById(currentUser?._id).select("-passsword -refreshtoken -createdAt -updatedAt");
            const userId: string | undefined = user?._id ? user._id.toString() : undefined;
            activeUsers.set(currentUser.username, userId);
            if (userId) {
                socket.join(userId);
            }
            socket.user = user;
            joinChat(socket); //mounting the join chat event when a user connects to the socket

        } else {
            console.log("Failed to get current user");
        }

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
            if (currentUser?.username) {
                activeUsers.delete(currentUser.username);
                if (socket?.user?._id) {
                    socket.leave(socket.user._id.toString());  //leaving teh socket room when user disconnected
                }
            }
        });
    });
};

export const joinChat = (socket: Socket) => {    //function to a join a chat weather a one on one or group chat
    socket.on("joinchat", ({ chatId }) => {
        socket.join(chatId);
    })
}

export const emitSocketEvent = (req: Request, roomId: string, event: string, payload: { messageContent: string, attachments: string[] }) => {
    const io = req.app.get("io") as Server | undefined; // Ensure io is recognized
    if (!io) {
        console.error("Socket.io instance is not available on req.app");
        return;
    }
    io.in(roomId).emit(event, payload);
};
