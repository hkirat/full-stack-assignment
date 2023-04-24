const express = require("express");
const session = require("express-session");
const bodyPerser = require("body-perser");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyPerser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your secret key",
    resave: false,
    saveUninitialized: false,
  })
);
const port = 3001;

const USERS = [
  {
    email: "john@example.com",
    password: "$2b$10$QjUuZ6SRnZ6UJfENj8WfnuS1y5AdM7oL.fv5G5w4uFZoJQso9XmJu", // "password"
  },
  {
    email: "jane@example.com",
    password: "$2b$10$GtRUrzST9JVlY42F55JiwejKkM.lwMS1Mv.1c.nTjTMsBAmCm9Xve", // "password123"
  },
];

const QUESTIONS = [
  {
    title: "Max In An Array",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const submissions = [
  {
    id: 1,
    title: "Two Sum",
    description:
      "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    solution:
      "var twoSum = function(nums, target) {\n    const map = new Map();\n    for(let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if(map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n};",
    difficulty: "Easy",
    language: "JavaScript",
    author: "John Doe",
    date: "2022-04-23",
  },
  {
    id: 2,
    title: "Add Two Numbers",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    solution:
      "function addTwoNumbers(l1, l2) {\n    let carry = 0;\n    const dummy = new ListNode();\n    let curr = dummy;\n    while (l1 || l2 || carry) {\n        const sum = (l1?.val || 0) + (l2?.val || 0) + carry;\n        carry = Math.floor(sum / 10);\n        curr.next = new ListNode(sum % 10);\n        curr = curr.next;\n        l1 = l1?.next;\n        l2 = l2?.next;\n    }\n    return dummy.next;\n}",
    difficulty: "Medium",
    language: "JavaScript",
    author: "Jane Doe",
    date: "2022-04-22",
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    solution:
      "var lengthOfLongestSubstring = function(s) {\n    const map = new Map();\n    let left = 0;\n    let maxLength = 0;\n    for (let right = 0; right < s.length; right++) {\n        if (map.has(s[right]) && map.get(s[right]) >= left) {\n            left = map.get(s[right]) + 1;\n        }\n        maxLength = Math.max(maxLength, right - left + 1);\n        map.set(s[right], right);\n    }\n    return maxLength;\n};",
    difficulty: "Medium",
    language: "JavaScript",
    author: "John Doe",
    date: "2022-04-21",
  },
];

const bcrypt = require("bcrypt"); // import bcrypt library for password hashing

app.post("/signup", async function (req, res) {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Check if user with email already exists
    const existingUser = USERS.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add new user to USERS array
    USERS.push({ email, password: hashedPassword });

    // Return HTTP 200 OK status code
    return res.status(200).send("Signup successful");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;

  try {
    // Check if the user with the given email exists in the USERS array
    const user = USERS.find((user) => user.email === email);

    if (!user) {
      // User not found
      return res.status(401).send({ error: "Invalid email or password" });
    }

    // Compare the password with the stored hash
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      // Passwords don't match
      return res.status(401).send({ error: "Invalid email or password" });
    }

    // Generate a JWT token and send it back to the client
    const token = jwt.sign({ email }, SECRET_KEY);
    res.status(200).send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions/:problemId", function (req, res) {
  //get the problem id from request parameters
  const problemId = req.params.problemId;
  //filter the submissions array to get the submissions for this problemId
  const problemSubmission = submissions.filter(
    (submission) => submission.id === parseInt(problemId)
  );
  // return the users submissions for this problem
  res.send(problemSubmission);
});
//define a middleware function to check if the user is admin
function isAdmin(req, res, next) {
  const { user } = req;

  //check if the user is an admin
  if (user && user.isAdmin) {
    next();
  } //user is an admin proceed to the next
  else {
    res.status(401).send("Unauthorized"); // User is not an admin, send an error response
  }
}
//now use the admin middleware for app.post
app.post("/submissions", isAdmin, function (req, res) {
  // Get the submission details from the request body
  const { title, description, solution, difficulty, language, author } =
    req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  // Generate a new ID for the submission
  const newId = submissions.length + 1;

  // Create a new submission object with the details and result
  const newSubmission = {
    id: newId,
    title,
    description,
    solution,
    difficulty,
    language,
    author,
    isAccepted,
    date: new Date().toISOString(),
  };

  // Store the submission in the submissions array
  submissions.push(newSubmission);

  // Return a response with the new submission
  res.status(201).send(newSubmission);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
