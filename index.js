const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

const USERS = [
  {
    name: "Tushar",
    email: "tusharvaishnav122@gmail.com",
    password: "tushar122",
    isAdmin: false,
  },
  {
    name: "tusharadmin",
    email: "tusharisadmin@gmail.com",
    password: "tusharadmin",
    isAdmin: true,
  },
];

const QUESTIONS = [
  {
    problemId: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
  {
    problemId: 2,
    title: "Three states",
    description:
      "Given an object , return the maximum from the array stored in an object?",
    testCases: [
      {
        input: [4, 43, 2, 3, 45, 43, 4, 76],
        output: "76",
      },
    ],
  },
  {
    problemId: 3,
    title: "Palindrome Check",
    description: "Given a string, check if it is a palindrome.",
    testCases: [
      {
        input: "racecar",
        output: "true",
      },
      {
        input: "hello",
        output: "false",
      },
    ],
  },
];

const SUBMISSIONS = [
  {
    problemId: "2",
    submissions: [
      {
        language: "JAVA",
        code: "System.out.println('test');",
      },
      { language: "PYTHON", code: "print('test2')" },
    ],
  },
];

app.use(bodyParser.json());
app.post("/signup", function (req, res) {
  console.log("signup", req.body);
  const { name, email, password, isAdmin } = req.body;
  if (USERS.find((ele) => ele.email == email)) {
    res.status(409).send({ error: "User with this email already exists" });
  } else if (!password) {
    res.status(400).send({ error: "Password is required" });
  } else {
    USERS.push({ name, email, password, isAdmin });
    return res.status(200).send({
      message: "User Registered Successfully",
      user: { name, email, password, isAdmin },
    });
  }
});

app.post("/login", function (req, res) {
  const token = Math.random().toString(36).substring(2, 10);
  const { email, password } = req.body;
  const userRec = USERS.find((ele) => ele.email == email);
  if (!userRec) {
    return res.status(404).json({ message: "User with this email not found." });
  } else if (userRec.password != password) {
    return res
      .status(401)
      .json({ message: "Invalid email or password. Please try again." });
  } else {
    return res
      .status(200)
      .json({ message: "User Successfully Logined", token: `${token}` });
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ QUESTIONS: QUESTIONS });
});
app.get("/submissions", function (req, res) {
  const problemId = req.query.id;
  if (!QUESTIONS.find((que) => que.problemId == problemId)) {
    return res
      .status(404)
      .json({ error: `Question with problem id ${problemId} not found` });
  }
  let submission = SUBMISSIONS.find((ele) => ele.problemId == problemId);
  if (submission) {
    res.status(200).json({ submissions: submission });
  } else {
    res
      .status(401)
      .json({ error: `No submissions found for problem id ${problemId}` });
  }
});
app.post("/submit", function (req, res) {
  const { solution, problemId } = req.body;
  const num = Math.floor(Math.random() * 2);

  if (!QUESTIONS.find((que) => que.problemId == problemId)) {
    return res
      .status(404)
      .json({ error: `Question with problem id ${problemId} not found` });
  }
  if (num == 1) {
    let present = false;
    SUBMISSIONS.forEach((element) => {
      if (element.problemId == problemId) {
        element.submissions.push(solution);
        present = true;
        return;
      }
    });
    if (!present) {
      let rec = {};
      rec.problemId = problemId;
      rec.submissions.push(solution);
      SUBMISSIONS.push(rec);
    }
    console.log(SUBMISSIONS);
    res.json({ message: "Solution Accepted Successfully" });
  } else {
    res.status(401).json({ error: "Solution Not Accepted" });
  }
});
app.post("/addProblem", function (req, res) {
  console.log(req.body);
  console.log(typeof QUESTIONS);
  console.log(QUESTIONS.length);
  const { user_email, title, description, testCases } = req.body;

  if (USERS.find((user) => user.email == user_email && user.isAdmin)) {
    QUESTIONS.push({
      problemId: QUESTIONS.length + 1,
      title: title,
      description: description,
      testCases: testCases,
    });
    res.status(200).json({ message: "Problem Added Successfully!" });
  } else {
    res.status(404).json({ error: "Only Admin User can add a problem." });
  }
});
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
