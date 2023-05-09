const express = require("express");
const router = require("./router/index.router");
const app = express();
const port = 3001;
app.use(express.json());

app.use("/", router);

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
