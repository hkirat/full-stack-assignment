var express = require("express");
var router = express.Router();

var { check } = require("express-validator");

const {
  questions,
  submissions,
  submission,
  question,
  isAdmin
} = require("../controllers/questions");

router.get("/questions", questions);
router.post("/question", isAdmin,  question);
router.get("/submissions", submissions);
router.post("/submission", submission);

module.exports = router;
