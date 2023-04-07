import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
const route = require("./routes/routes");

const app = express();
app.use(
  cors({
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", route);

//Database connection
const MONGO_URI =
  "mongodb+srv://bidyut10:kabir34268@cluster0.rw6eu.mongodb.net/CoderVillage?retryWrites=true&w=majority";
mongoose.Promise = Promise;
mongoose.connect(MONGO_URI);
mongoose.connection.on("error", (error: Error) => console.log(error));

//port
app.listen(process.env.PORT || 3001, function () {
  console.log(
    "Express app running on port http://localhost:" + (process.env.PORT || 3001)
  );
});
