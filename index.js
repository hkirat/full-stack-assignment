// All imports
const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, Question, Submission } = require("./models/Schema");

// Enviroment variables
const port = process.env.PORT_NO || 5000;
const db = process.env.MONGODB_URL;
const secretString = process.env.JWT_SECRET;

// Middlewares
// enables Cross-Origin Resource Sharing (CORS) by adding the necessary headers to the response.
app.use(cors());

//parses incoming requests with JSON payloads and makes the parsed data available in the req.body object.
app.use(bodyParser.json());

// verifies the JWT token sent by the user in the authorization header of the request.
const auth = async (req, res, next) => {
  // Get the token from the authorization header
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, secretString);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Connected to MongoDb and listening on PORT
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Database Connection successfull and running on port: ${port}`
      );
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Generate the token
const createToken = (_id) => {
  let token = jwt.sign({ _id }, secretString, { expiresIn: "3d" });
  return token;
};

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is not Valid" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    // Create new user
    const user = new User({ name, email, password });
    if (isAdmin) {
      user.isAdmin = true;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    const token = createToken(user._id);
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if user exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email Address" });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token with user id as payload
    const token = createToken(user._id);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/questions", auth, async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/questions", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ message: "Only admins can post questions" });
    }
    // Get question details from request body
    const { title, description, testCases } = req.body;

    // Create new question object
    const newQuestion = new Question({
      title,
      description,
      testCases,
    });

    // Save new question to database
    await newQuestion.save();
    res.status(201).json({ message: "Question created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/submissions/:problemId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;

    // Find all submissions for the specified user and problem ID
    const submissions = await Submission.find({ userId, problemId });

    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/submissions", auth, async (req, res) => {
  try {
    const { userId, questionId, answer } = req.body;
    // Check if user and question exist
    const user = await User.findById(userId);
    const question = await Question.findById(questionId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Randomly accept or reject the answer for now
    const status = Math.random() < 0.5 ? "Accepted" : "Rejected";

    // Create a new submission
    const submission = new Submission({
      user: user._id,
      question: question._id,
      answer,
      status,
    });
    await submission.save();

    res.status(201).json({ submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
