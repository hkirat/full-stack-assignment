const router = require("express").Router();
const { questions } = require("../controllers/ques");

router.route("/ques").get(questions);

module.exports = router;
