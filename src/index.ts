import express, { Express, Request, Response } from "express";
import config from "./config";
import mongoose from "mongoose";
import { connectToMongoDB } from "./utils/db";

const app: Express = express();

// Middleware to parse JSON request body and adds it to 'req.body'
app.use(express.json());

// Establish connection with database
connectToMongoDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
