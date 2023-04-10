//
// requiring mongoose
const mongoose = require("mongoose");

// creating schema for data
const userSchema = new mongoose.Schema({
  dbName: {
    type: String,
    required: true,
    },

  dbEmail: {
    type: String,
    required: true,
    unique: true
    },

  dbPassword: {
    type: String,
    required: true,
    },

  dbConfirmPassword: {
    type: String,
    required: true,
    }
});

// creating collections for the DB
  const UserCollection = new mongoose.model("UserCollection", userSchema);

module.exports = UserCollection;