const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let QuestionShema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  testCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
    },
  ],
});

const Question = mongoose.model("Question", QuestionShema);

const SubmissionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Accepted", "Rejected"],
    required: true,
  },
});

const Submission = mongoose.model("Submission", SubmissionSchema);

let UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  completedQuestions: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
});

// In this case, we are using references to link user documents in the users collection to question documents in the questions collection.

const User = mongoose.model("User", UserSchema);
module.exports = { User, Question, Submission };
