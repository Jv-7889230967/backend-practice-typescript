import express from "express";
import dotenv from "dotenv";
import userRouter from "./Routes/UserRoutes"
import { errorHandler } from "./middlewares/ErrorMiddleware";
import connectDB from "./DB";
dotenv.config({path:'../.env'});
const app = express();

connectDB(); // calling the DB connect function here
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use(errorHandler);

app.listen(5000, () => {
  console.log(`Server running at 5000`);
});
