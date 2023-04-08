const mongoose = require("mongoose");
const { Schema } = mongoose;
const subscriberData = new Schema({
  name: {
    type: String,
    unique: false,
    required: false,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  passport: {
    type: String,
    unique: false,
    required: true,
  },
  passport_confirm: {
    type: String,
    unique: false,
    required: true,
  },
  contact: {
    required: false,
    type: Number,
  },
  google_id: {
    type: Number,
    required: false,
    default: 100,
  },
  questions: {
    type: [String],
    default: [],
    required: false,
  },
});

const Subscriber = mongoose.model("Subscriber", subscriberData);
module.exports = Subscriber;
