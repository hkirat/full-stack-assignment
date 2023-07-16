const mongoose = require("mongoose");
const problemSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    testCases: {
        type: [{
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }],
        required: true
    }
}, {
    timestamps: true
});
const problemModel = mongoose.model("Problem", problemSchema);
module.exports = problemModel;