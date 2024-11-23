import express from "express";
import userRouter from "./Routes/UserRoutes";
import profileRouter from "./Routes/SocialProfile"
import { errorHandler } from "./middlewares/ErrorMiddleware";
import connectDB from "./DB";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();

connectDB(); // calling the DB connect function here
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/social", profileRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
