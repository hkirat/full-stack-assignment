const express = require("express");
const app = express();

app.use(express.json());

const user = require("./routes/user");
const ques = require("./routes/ques");
const submissions = require("./routes/submission");

app.use("/api/v1", user);
app.use("/api/v1", ques);
app.use("/api/v1", submissions);

app.listen(5000, function () {
  console.log(`Example app listening on port 5000`);
});
