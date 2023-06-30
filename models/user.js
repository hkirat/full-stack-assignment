const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email : {
        type : String
    },
    password : {
        type : String
    }
},{timestamps : true});

module.exports = mongoose.model("User",userSchema);