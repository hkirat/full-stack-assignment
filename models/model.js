import { model, Schema } from "mongoose";

export const User = model(
  "User",
  new Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  })
);

export const Questions = model(
  "Questions",
  new Schema({
    title: String,
    description: String,
    testCases: [{ input: String, output: String }],
  })
);

export const Submissions = model(
  "Submissions",
  new Schema({
    problem: String,
    solution: String,
    isAccepted: Boolean,
  })
);
