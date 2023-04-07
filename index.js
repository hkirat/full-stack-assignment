const express = require("express");
const app = express();

app.use(express.json());
const port = 3000;

// Route imports
const user = require("./routes/userRoutes");

app.use("/api/", user);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
