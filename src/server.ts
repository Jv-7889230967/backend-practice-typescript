import express from "express";
import profileRouter from "./Routes/social/SocialProfile.js";
import { errorHandler } from "./middlewares/ErrorMiddleware.js";
import { configDotenv } from "dotenv";
import userRouter from "./Routes/auth/UserRoutes.js";
import followRouter from "./Routes/social/SocialFollowers.js";
import postRouter from "./Routes/social/SocialPost.js";
import likeRouter from "./Routes/social/SocialLike.js";
import commentRouter from "./Routes/social/SocialComment.js";
import chatRouter from "./Routes/chat/chats.js";
import messageRouter from "./Routes/chat/message.routes.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { initializeSocket } from "./socket.js";
import connectDB from "./DB/index.js";


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
