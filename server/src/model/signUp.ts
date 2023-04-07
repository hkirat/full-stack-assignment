import mongoose, { Document, Model, Schema } from "mongoose";

interface ISignUp extends Document {
  name: string;
  phone: string;
  email: string;
  password: string;
  accountType: "User" | "Admin";
  createdAt: Date;
  updatedAt: Date;
}

const SignUpSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },
    accountType: {
      type: String,
      required: true,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  { timestamps: true }
);

const SignUpDetails: Model<ISignUp> = mongoose.model<ISignUp>(
  "SignUpDetails",
  SignUpSchema
);

export default SignUpDetails;
