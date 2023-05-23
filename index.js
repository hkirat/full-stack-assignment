import express from "express";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

const app = express();
const port = 3001;

// Parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoutes);
app.use("/questions", questionRoutes);
app.use("/submissions", submissionRoutes);

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
