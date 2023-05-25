import express from "express";
import { PORT } from "./config/index.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/questions", questionRoutes);
app.use("/submissions", submissionRoutes);

app.listen(PORT, function () {
  console.log(`Server running on port : ${PORT}`);
});
