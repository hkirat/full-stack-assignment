const { getSubmissions, postSubmission } = require("../controllers/submission");

const router = require("express").Router();

router.route("/submissions").get(getSubmissions).post(postSubmission);

module.exports = router;
