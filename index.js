const express = require('express')
const app = express()
const port = 3001
require("dotenv").config();
const authRoutes = require("./routes/auth");
const questionsRoutes = require("./routes/questions");

app.use(express.json());


app.use("/api", authRoutes);
app.use("/api", questionsRoutes);

app.listen(port, ()=>{
  console.log(`Example app listening on port ${port}`);
})