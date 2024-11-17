import mongoose from "mongoose";
import { DB_NAME } from "../constants";


const connectDB = async ():Promise<void> => {
    try {
        // console.log("DB string",process.env.MONGO_CONNECTION_URI);
        await mongoose.connect(`mongodb+srv://jatinverma:vermas123@cluster0.sqcbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/${DB_NAME}`);  // using mongoose ORM to connect to mongodb using our private mongodb URI
        console.log('MongoDB Connected...');
    } catch (error) {
        console.log("DB error occurred", error);
        process.exit(1);
    }
}
export default connectDB;