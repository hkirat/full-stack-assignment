import dotenv from "dotenv";

// This will load the environment variables from `.env` file
dotenv.config();

// Configuration values
const config = {
  port: process.env.PORT && parseInt(process.env.PORT),
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
};

export default config;
