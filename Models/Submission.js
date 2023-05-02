const mongoose = require('mongoose');

const SubSchema = new mongoose.Schema({
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    language:{
        type: String,
        required: true,
    },
    answer:{
        type:String,
        required: true,
    },
    isCorrect:{
        type: Boolean,
    },
})

const Submission = mongoose.model("Submission", SubSchema);

module.exports = Submission;
