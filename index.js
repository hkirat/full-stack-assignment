const express = require('express')
const app = express()
const port = 3001
require("dotenv").config();
const authRoutes = require("./routes/auth");
const questionsRoutes = require("./routes/questions");

app.use(express.json());

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.use("/api", authRoutes);
app.use("/api", questionsRoutes);

app.listen(port, ()=>{
  console.log(`Example app listening on port ${port}`);
})