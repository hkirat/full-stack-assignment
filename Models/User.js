const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    access:{
        type: String,
        default: "User"
    }
})

const User = mongoose.model("User", UserSchema);

module.exports = User;
