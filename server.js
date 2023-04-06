import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import colors from "colors";

dotenv.config({ path: "./config/config.env" });

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server listening on port`,
    ` http://localhost:${PORT}`.yellow.bold
  );
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
