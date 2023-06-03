const express = require("express");
const app = express();
const port = 3002;

app.use(express.urlencoded({ extended: true })); //is used to parse URL-encoded form data
app.use(express.json()); // Example built-in middleware - is used to parse JSON data

const USERS = [
  {
    email: "snehajais03@gmail.com",
    password: "sneha123",
  },
];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSION = [
  {
    userId: "001",
    questionId: "1",
    code: "function max() { return }; }",
    status: "accepted",
  },
  {
    userId: "001",
    questionId: "2",
    code: "function max() { return }; }",
    status: "rejected",
  },
];

//==>Generate Random String function
const generateRandomString = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

//==>Routes
app.post("/signup", function (req, res) {
  try {
    const { email, password } = req.body;
    const newUser = { email: email, password: password };
    //validation
    if (USERS.find((USERS) => USERS.email == email)) {
      return res.status(409).send("You are already registered.");
    }
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide all the required fields." });
    }
    USERS.push(newUser);
    res.status(200).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", function (req, res) {
  try {
    const { email, password } = req.body;
    const existingUser = { email: email, password: password };
    console.log(existingUser);
    console.log(USERS);
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    if (
      USERS.find((USERS) => USERS.email == email) &&
      USERS.find((USERS) => USERS.password == password)
    ) {
      const token = generateRandomString(12);
      return res
        .status(200)
        .json({ token: token, message: "Logged in successfully" });
    }
    if (
      USERS.find((USERS) => USERS.email != email) ||
      USERS.find((USERS) => USERS.password != password)
    ) {
      return res.status(404).send("Invalid Credentials. Please try again!");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/questions", function (req, res) {
  res.status(200).json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  res.json(SUBMISSION);
  res.send("Hello World from route 4!");
});

app.post("/submissions", function (req, res) {
  const { userId, questionId, code, status } = req.body;
  const submissions = { userId, questionId, code, status };
  if (status === "accepted") {
    SUBMISSION.push(submissions);
    res.status(200).json({ message: "Submission accepted" });
  }
  alert("Submissions Failed!");
  res.status(200).json({ message: "Submission failed" });
});

app.post("/addProblems", function (req, res) {
  const { role, problem } = req.body;
  if (!role || !problem)
    res
      .status(401)
      .json({ message: "Role and problem statement is required." });
  const admin = role === "admin";
  if (admin) {
    const { title, description, testCases } = problem;
    if (!title || !description || !testCases) {
      res.status(401).json({ message: "Something went wrong. Try again!" });
    } else {
      QUESTIONS.push(problem);
      res.status(200).json({ message: "New Question added!" });
    }
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
