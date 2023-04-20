const { model, Schema } = require("mongoose");

// Scheme for Questions collections
const questionSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    statement: {
      type: String,
      unique: true,
      required: true,
    },
    testcases: [
      {
        input: String,
        output: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Question = model("Question", questionSchema);
module.exports = Question;
