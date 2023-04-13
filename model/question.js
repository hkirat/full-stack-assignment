class QuestionModel {
  constructor(title, description, testCases) {
    this.id = 0;
    this.title = title;
    this.description = description;
    this.testCases = testCases;
  }
}

module.exports = QuestionModel;
