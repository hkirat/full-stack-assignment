import adminRoute from "./routes/adminRoute";
import problemRoute from "./routes/problemRoute";
import userRoute from "./routes/userRoute";
import submissionRoute from "./routes/submissionRoute";

const express = require("express");

const app = express();
const port = 3001;

app.use(express.json());
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/problems", problemRoute);
app.use("/submissions", submissionRoute);

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
