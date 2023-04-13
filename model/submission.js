class SubmissionModel {
  constructor(userEmail, questionId, sumbittedSolution) {
    this.userEmail = userEmail;
    this.questionId = questionId;
    this.sumbittedSolution = sumbittedSolution;
    this.passedTests = false;
  }
}

module.exports = SubmissionModel;
