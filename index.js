import express, { json } from "express";
import { connect } from "mongoose";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/verifyToken.js";
import {
  getQuestions,
  getSubmissions,
  setSubmissions,
  setQuestions,
} from "./controllers/user.js";
import { register, signIn } from "./controllers/auth.js";

const port = 3001;
const app = express();
dotenv.config();

// Accessing the values
const mongoDbUsername = process.env.MONGODB_USERNAME;
const mongoDbPassword = process.env.MONGODB_PASSWORD;

// connect to mongoose Database
connect(
  `mongodb+srv://${mongoDbUsername}:${mongoDbPassword}@cluster0.x1qa2ut.mongodb.net/full_stack_assignment?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  }
)
  .then(() => {
    console.log("connected to MongoDB Database");
  })
  .catch((err) => {
    console.error(`Error while connected to database`, err);
  });

app.use(json()); // Middleware to pass JSON request Body

app.post("/signup", register);

app.post("/login", signIn);

app.get("/questions", verifyToken, getQuestions);

app.get("/submissions/:id", verifyToken, getSubmissions);

app.post("/submissions/:id", verifyToken, setSubmissions);

app.post("/questions", verifyToken, setQuestions);

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
