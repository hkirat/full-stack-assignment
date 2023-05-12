const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());
const USERS = [];
console.log(USERS);
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

const SUBMISSION = [];

//SignUp Page

app.post("/signup", function (req, res) {
  try {
    const { email, password, isAdmin } = req.body;

    if (!email || !password || !isAdmin) {
      return res.status(404).send({
        message: "Email or Password is not Provided",
      });
    }

    if (USERS.some((user) => user.email == email)) {
      return res.status(400).send({
        message: "Email already Exist!!!",
      });
    } else {
      USERS.push({ email, password, isAdmin });
      res.status(201).send({
        message: "User Created",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error while creating a User",
    });
  }
});

//Login Page

app.post("/login", function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).send({
        message: "Email or Password is not Provided",
      });
    }

    const user = USERS.find((user) => user.email === email);
    if (!user) {
      return res.status(401).send({
        message: "Failed!!! Email does not Exist",
      });
    }

    if (user.password !== password) {
      return res.status(401).send({
        message: "Failed!!! Password is inncorrect",
      });
    } else {
      const token = "random-token";
      res.status(200).send({
        message: "Login Successfull",
        token: token,
      });
    }
  } catch (err) {}
});

//Question Page

app.get("/questions", function (req, res) {
 
  res.json(QUESTIONS);
});

//Submission Page

app.get("/submissions", function (req, res) {

  const problemId = req.query.problemId;
  if (!problemId) {
    return res.status(401).send({
      message: "Problme Id is not Provided",
    });
  }
  const submission = SUBMISSION.filter(
    (submission) => submission.problemId === problemId
  );
  res.json(submission);
});

//Submission

app.post("/submissions", function (req, res) {
  const { problemId, solution } = req.body;
  if (!problemId || !solution) {
    return res.status(400).send({
      message: "Failed!!! problemId or soluition is not provided",
    });
  }
  const isAccepted = Math.random() < 0.5;
  SUBMISSION.push({
    problemId,
    solution,
    isAccepted,
  });
  res.json({
    message: isAccepted
      ? "Submission Successfull"
      : "Submission is not Successfull",
  });
});

const isAdmin = (req, res, next) => {
  const { isAdmin } = true; //her i wanted to take token where user login but i think i need to used jsonWebToken and a database
  if (isAdmin) {
    return res.status(400).send({
      message: "Unauthorized Access! You are not an admin.",
    });
  }
  next();
};
app.post("/problems", isAdmin, function (req, res) {
  const { title, description, testCases } = req.body;
  if (!title || !description || !testCases) {
    return res.status(400).send({
      message: "Failed!!! title ,description or testCases is not Provided",
    });
  }

  const id = Math.random().toString(36).substring(2, 8);
  QUESTIONS.push({
    id,
    title,
    description,
    testCases,
  });
  res.status(201).send({
    id,
    message: "Problem Created Successfully",
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
