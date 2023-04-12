import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

/********************* Middlewares **********************/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authorization = (req, res, next) => {
  try {
    // "authorization" : "Bearer <token>"
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    jwt.verify(token, secretKey, (error, user) => {
      if (error) return res.sendStatus(403);
      // add property user to req
      req.user = {
        userId: user.userId,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      next();
    });
  } catch (error) {
    next(error);
  }
};

/********************* Data Stores **********************/
let USERS = [
  // {
  //   userId: "1",
  //   username: "johndoe",
  //   email: "john@doe.com",
  //   password: "johndoe",
  //   isAdmin: "true",
  // },
  // {
  //   userId: "2",
  //   username: "janedoe",
  //   email: "jane@doe.com",
  //   password: "janedoe",
  //   isAdmin: "false",
  // }
];

let QUESTIONS = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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

let SUBMISSION = [
  {
    submissionId: "1",
    questionId: "1",
    userId: "1",
    code: "function max(arr){ return Math.max(...arr) }",
    status: "accepted",
  },
  {
    submissionId: "2",
    questionId: "1",
    userId: "1",
    code: "function max(arr){ return Math.min(...arr) }",
    status: "rejected",
  },
  {
    submissionId: "3",
    questionId: "2",
    userId: "2",
    code: "function max(arr){ return Math.min(...arr) }",
    status: "rejected",
  },
  {
    submissionId: "4",
    questionId: "2",
    userId: "3",
    code: "function max(arr){ return Math.min(...arr) }",
    status: "rejected",
  },
  {
    submissionId: "5",
    questionId: "1",
    userId: "2",
    code: "function max(arr){ return Math.min(...arr) }",
    status: "rejected",
  },
];

/********************* Routes **********************/

/********************* Sign Up ************************/

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailUsed = USERS.some((user) => user.email === email);
    if (emailUsed) {
      return res.status(409).json({ message: "Email already exists!" });
    }

    const userId = USERS.length + 1;
    const username = email.split("@")[0];
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hashSync(password, saltRounds);
    // add the user to the USERS array
    USERS.push({
      userId: userId,
      username: username,
      email: email,
      password: hashedPassword,
      isAdmin: false,
    });

    // return back 200 status code to the client
    return res
      .status(200)
      .json({ message: "User created successfully!", users: USERS });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

/********************* Login ************************/

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await USERS.find((user) => user.email === email);
    if (!user) res.status(401).json({ message: "User not found!" });

    // check if password is correct
    const passwordCorrect = await bcrypt.compareSync(password, user.password);
    if (!passwordCorrect)
      return res.status(401).json({ message: "Password is incorrect!" });

    // successfully logged in
    const payload = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const options = {
      expiresIn: "1d",
    };
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign(payload, secretKey, options);

    res.status(200).json({ token: token, user: payload });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

/********************* Questions ************************/

app.get("/questions", (req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

/********************* Submissions ************************/

app.get("/submissions", authorization, (req, res) => {
  try {
    // return the user all the submissions in the SUBMISSION array
    const submissions = SUBMISSION.filter(
      (submission) => submission.userId == req.user.userId
    );
    res.json({ user: req.user, submissions: submissions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

app.post("/submissions", authorization, (req, res) => {
  try {
    const { questionId, code } = req.body;
    const userId = req.user.userId;
    const status = Math.random() > 0.5 ? "accepted" : "rejected";
    const submissionId = SUBMISSION.length + 1;

    SUBMISSION.push({ submissionId, questionId, userId, code, status });

    res.json({
      submissionId: submissionId,
      questionId: questionId,
      userId: userId,
      code: code,
      status: status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
