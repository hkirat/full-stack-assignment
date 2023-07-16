const mongoose = require("mongoose");
const executionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
    },
    src: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true
    },
    input: {
        type: String
    },
    status: {
        type: String,
        required: true,
        default: "Queued"
    }
}, {
    timestamps: true
});
const executionModel = mongoose.model("Execution", executionSchema);
module.exports = executionModel;