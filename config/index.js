import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 3001;

export const JWT_SECRET = process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiJ9";
export const JWT_EXPIRE = process.env.JWT_EXPIRE || "1h";
