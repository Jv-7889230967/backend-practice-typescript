import express from "express";
import profileRouter from "./Routes/social/SocialProfile"
import { errorHandler } from "./middlewares/ErrorMiddleware";
import connectDB from "./DB";
import { configDotenv } from "dotenv";
import userRouter from "./Routes/auth/UserRoutes";
import followRouter from "./Routes/social/SocialFollowers";

configDotenv();

const app = express();

connectDB(); // calling the DB connect function here
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/social", profileRouter,followRouter);


app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
