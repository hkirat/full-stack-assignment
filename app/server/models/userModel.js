const mongoose = require("mongoose");
const userModelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        required: true,
        default: ['user']
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("User", userModelSchema);