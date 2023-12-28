import { Request } from "express";

export interface User {
  email: string;
  password: string;
  userType: string;
}

export interface TokenObject {
  email: string;
  userType: string;
}

export interface CustomRequest extends Request {
  user?: any;
}
