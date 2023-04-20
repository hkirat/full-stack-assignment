const mongoose = require("mongoose");
const config = require("../config");

async function connectToMongoDB() {
  try {
    // Getting the connection uri from config
    const mongoURI = config.mongoURI;

    // If mongouri string is not provided
    if (!mongoURI) throw new Error("Database connection string not provided");

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to the database!");
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { connectToMongoDB };
