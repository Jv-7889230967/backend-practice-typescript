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
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { initializeSocket } from "./socket";
// import { intializeSocket } from "./socket";

configDotenv();
const app = express();

connectDB(); // calling the DB connect function here
// connectRedis();
const server = createServer(app);

const io = new Server(server);

initializeSocket(io);
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/social", profileRouter, followRouter, postRouter, likeRouter, commentRouter);

app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
