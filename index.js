const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", require("./app/routes"));

app.use(async (req, res, next) => {
  return res.status(404).send({
    status: "Fail",
    code: 404,
    message: "Internal Server Error",
  });
});

const port = 3001;
app.listen(port, () => console.log(`Example app listening on port ${port}`));
