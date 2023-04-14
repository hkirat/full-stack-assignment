import express, { Express, Request, Response } from "express";
import config from "./config";
import authRouter from "./routers/auth";
import { connectToMongoDB } from "./utils/db";

const app: Express = express();

// Middleware to parse JSON request body and adds it to 'req.body'
app.use(express.json());

// Establish connection with  
connectToMongoDB();

// Routes
app.use('/', authRouter);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
