require("dotenv").config();
const express = require("express");
const router = require("./router/index.router");
const cors = require("cors");
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());
app.use("/", router);

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
