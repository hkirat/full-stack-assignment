import express from "express";
const router = express.Router();
const userAndAdminController = require("../controller/userAndAdminController");
const questionController = require("../controller/questionController");
const answerController = require("../controller/answerController");
const auth = require("../authentication/auth");



//signup and login route
router.post(
  "/signup", 
  userAndAdminController.signUpRequest
);
router.post(
  "/login", 
  userAndAdminController.loginRequest
);

//question route
router.post(
  "/addquestions",
  auth.adminAuthentication,
  questionController.addQuestionRequest
);
router.get(
  "/allquestions", 
  questionController.allQuestionsRequest
);

//answer route
router.post(
  "/submitted",
  auth.userAuthentication,
  answerController.submitAnswerRequest
);
router.get(
  "/submittedanswer/:questionId",
  auth.userAuthentication,
  answerController.allSubmittedAnswersRequest
);



//unknown request route
router.all("/***", function (req: express.Request, res: express.Response) {
  res.status(404).send({
    status: false,
    msg: "Invalid Request",
  });
});

module.exports = router;
