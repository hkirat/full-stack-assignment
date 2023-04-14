import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

// Scheme for User collection
const userSchema = new Schema<IUser>(
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

// Hash password before saving or updating to database
userSchema.pre<IUser>("save", async function (next) {
  // The current user record being updated
  const user = this;

  // Only hash password if it has been modified or is new
  if (!user.isModified("password")) return next();

  // Hash the password with the salt
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Execute the next in hierarchy
  next();
});

// Create the model
const User = model<IUser>("User", userSchema);
export default User;
