import express, { Express } from "express";
import cors from "cors";
import config from "./config";
import statRouter from "./routers/stats";
import authRouter from "./routers/auth";
import questionRouter from "./routers/question";
import submissionRouter from "./routers/submission";
import { connectToMongoDB } from "./utils/db";

const app: Express = express();

// Middleware to parse JSON request body and adds it to 'req.body'
app.use(express.json());

// Middleware to enable Cross-Origin Resource Sharing (CORS) to allow requests from other domains
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  exposedHeaders: "Authorization",
}));

// Establish connection with
connectToMongoDB();

// Routes
app.use("/", authRouter);
app.use("/", questionRouter);
app.use("/", submissionRouter);
app.use("/", statRouter);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
