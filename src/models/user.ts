import { Schema, model } from "mongoose";

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

// Scheme for User collection
const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
  },
  {
    timestamps: true, // To automatically add `createdAt` and `updatedAt` fields
    versionKey: false, // `__v` attribute in mongodb will not be added
  }
);

const UserModel = model<User>("User", userSchema);
export default UserModel;
