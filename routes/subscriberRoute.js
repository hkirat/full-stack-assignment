const router = require("express").Router();
const {
  signupControl,
  loginControl,
  myQuestions,
  submitQuestion,
  validateSubmission,
  askQuestion,
  protect,
} = require("./../authServices/subscriberController");

// studentRouter route distributing:
router.route("/signup").post(signupControl);
router.route("/login").post(loginControl);
router.route("/questions").post(protect, askQuestion).get(protect, myQuestions);
router
  .route("/submissions")
  .post(protect, validateSubmission)
  .patch(protect, submitQuestion);

module.exports = router;
