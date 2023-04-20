const dotenv = require("dotenv");
dotenv.config();

const config = {
  port: process.env.PORT && parseInt(process.env.PORT),
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;
