import express from "express";
import user from "./routes/userRoute.js";

const app = express();
app.use(express.json());

app.use("/api/v1", user);

export default app;
