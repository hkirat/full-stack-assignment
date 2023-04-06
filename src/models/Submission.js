const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  code: { type: String, required: true }, //code by the user
  language: {
    type: String,
    required: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});


const Submission = new mongoose.model("Submission", submissionSchema);

module.exports = Submission;
