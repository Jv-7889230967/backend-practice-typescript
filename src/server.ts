import express from "express";
import profileRouter from "./Routes/social/SocialProfile"
import { errorHandler } from "./middlewares/ErrorMiddleware";
import connectDB from "./DB";
import { configDotenv } from "dotenv";
import userRouter from "./Routes/auth/UserRoutes";
import followRouter from "./Routes/social/SocialFollowers";
import postRouter from "./Routes/social/SocialPost";
import likeRouter from "./Routes/social/SocialLike";
import commentRouter from "./Routes/social/SocialComment";
import chatRouter from "./Routes/chat/chats";
import messageRouter from "./Routes/chat/message.routes"
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { initializeSocket } from "./socket";

configDotenv();
const app = express();

connectDB(); // calling the DB connect function here

const server = createServer(app);
const io = new Server(server);

app.set("io", io) //setting the socket io server instance to the app to get it later in the app to emit events
// console.log(app)
initializeSocket(io);
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/social", profileRouter, followRouter, postRouter, likeRouter, commentRouter);
app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/message", messageRouter)

app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
