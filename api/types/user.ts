import { Request } from "express";
import z from "zod";

export const userMinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const userSchema = userMinSchema.extend({
  phone: z
    .string()
    .min(10, "Number must be of 10 digits")
    .max(10, "Number must be of 10 digits"),
});

export interface User {
  email: string;
  password: string;
  userType: string;
}

export interface TokenObject {
  email: string;
  userId: string;
  userType: string;
}

export interface CustomRequest extends Request {
  userId?: string;
}
