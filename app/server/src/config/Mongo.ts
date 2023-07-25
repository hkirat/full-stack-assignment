import mongoose, { Document, Model, Schema } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const MongoDBConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected to MongoDB");
    }
    catch (e: any) {
        console.log("Error connecting to DB", e.stack);
    }
};
export default MongoDBConnect;