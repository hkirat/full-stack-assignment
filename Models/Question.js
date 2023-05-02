const mongoose = require('mongoose')

const QuestionSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    difficulty:{
        type: String,
        required: true,
    },
    acceptance:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    examples:{
        type: Array,
        required: true,
    },
    testCases:{
        type: Array,
        required: true
    },
    adminid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

const Question = mongoose.model("Question", QuestionSchema)

module.exports = Question;
