import express from "express";
import indexRouter from "./routes/route.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(cookieParser());

//using Routes
app.use(indexRouter);

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
