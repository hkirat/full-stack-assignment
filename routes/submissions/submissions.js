const express = require("express");
const router = express.Router();

router.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send("Hello World from route 4!");
});

router.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!");
});

module.export = router;
