const express = require("express"); // using commonJS to import this
const app = express(); // making and instance
const port = 3000;

// Middleware
// Informal -         This is a middleware, kind of dalal(indian slang)
// Professionally -   This is a bridge b/w client and server.
// What this does? -  This is basically used to parse JSON data which you got and attach it to req.body property, which you can access later.
app.use(express.json());

const USERS = [];

const QUESTIONS = [
  {
    problemId: 265,
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

app.get("/", (req, res) => res.send("We are new leatcode...haha"));

app.post("/signup", function (req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ error: "All feilds required" });

  // sidenote - this is advanced object literal(search for it)
  const newUser = { email, password };
  USERS.push(newUser);

  res.status(200).send({ message: "Signup successful" });
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ error: "All feilds required" });
  const validUser = USERS.find(
    (user) => user.email === email && user.password === password
  );
  if (!validUser)
    res.status(401).send({ error: "Invalid username or password" });
  const token = `HarikatWhenAreYouSendingDiscordServerInvite`;
  res.status(200).send({ message: "Login successful", token });
});

app.get("/questions", function (req, res) {
  // hardest amongst all...hahahaha
  res.status(200).send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  const { problemId } = req.query;
  const userSubmissions = SUBMISSION.filter(
    (sub) => sub.problemId === problemId
  );
  res.status(200).send(userSubmissions);
});

app.post("/submissions", function (req, res) {
  const { problemId, solution } = req.body;
  // 50-50 changes.
  const isAccepted = Math.random() < 0.5;
  const submission = {
    problemId,
    solution,
    isAccepted,
  };
  SUBMISSION.push(submission);
  res.status(200).send({ status: isAccepted ? "accepted" : "rejected" });
});

const authenticate = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send({ error: "All feilds required" });

  if (username !== "admin" || password !== "adminPassword")
    return res.status(401).send("Unauthorized");

  next();
};

app.post("/problemAdd", authenticate, (req, res) => {
  const { problemId, title, description, testCases } = req.body;
  if (!problemId || !title || !description || !testCases)
    return res.status(400).send({ error: "All feilds required" });

  const question = { problemId, title, description, testCases };
  QUESTIONS.push(question);
  res.status(200).send({ status: "Problem added" });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
