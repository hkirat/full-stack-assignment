import express, { Express } from "express";
import config from "./config";
import authRouter from "./routers/auth";
import questionRouter from "./routers/question";
import { connectToMongoDB } from "./utils/db";

const app: Express = express();

// Middleware to parse JSON request body and adds it to 'req.body'
app.use(express.json());

// Establish connection with
connectToMongoDB();

// Routes
app.use("/", authRouter);
app.use("/", questionRouter);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
