const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const app = express();
const User = require("./model/userModel");
const Questions = require("./model/questionsModel");
const Submission = require("./model/submissions");
const Port = process.env.PORT || 4001;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const initializeDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB Connection Successful");
    app.listen(Port, () => {
      console.log(`Server Running At ${Port}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

initializeDb();

app.post("/signup", async (req, res) => {
  const { firstName, lastName, role, email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      res.status(400).json({ message: "Email Already Exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        firstName,
        lastName,
        role,
        email,
        password: hashedPassword,
      });
      res.status(200).json({ message: "User Created Successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email not registered" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password not matched" });
    }
    const token = await jwt.sign(email, process.env.SECRET);
    res.status(200).json({ message: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/login/admin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role !== "Admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ message: "Hello Admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/admin/questions", async (req, res) => {
  const { title, description, testCases } = req.body;
  try {
    await Questions.create({ title, description, testCases });
    res.status(200).json({ message: "Question added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/questions", async (req, res) => {
  try {
    const questions = await Questions.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/submissions", async (req, res) => {
  const { problemId, userId } = req.query;

  try {
    const submissions = await Submission.find({
      problem: problemId,
      user: userId,
    })
      .populate("problem", "title")
      .exec();
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/submissions", async (req, res) => {
  const { problemId, userId, solution } = req.body;
  const isAccepted = Math.random() < 0.5;

  const newSubmission = new Submission({
    problem: problemId,
    user: userId,
    solution: solution,
    isAccepted: isAccepted,
  });

  try {
    await newSubmission.save();
    res.status(200).json({ message: isAccepted ? "Accepted" : "Rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
