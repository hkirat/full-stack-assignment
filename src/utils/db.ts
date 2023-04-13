import mongoose from "mongoose";
import config from "../config";

// This function will connect api to mongodb database
async function connectToMongoDB() {
  try {
    // Getting the connection uri from config
    const mongoURI: any = config.mongoURI;

    // If mongouri string is not provided
    if (!mongoURI) throw new Error("MongoDB connection string not provided");

    // Connect to mongodb
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log("Connected to MongoDB!");
  } catch (error: unknown) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
}

export { connectToMongoDB };
