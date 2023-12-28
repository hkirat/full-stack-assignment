import { Router, Response } from "express";
import { User } from "../types/user";
import { CustomRequest } from "../types/user";
import jwt, { Secret } from "jsonwebtoken";
import { adminAuthorization, secret } from "../middleware/auth";
import { QUESTIONS } from "./problemRoute";
import { v4 as uuid } from "uuid";

const router = Router();

const users: User[] = [];

router.post("/signup", (req: CustomRequest, res: Response) => {
  const body = req.body;
  const email = body["email"];
  const password = body["password"];

  if (users.find((user) => user.email === email)) {
    return res.status(400).send("User already exists");
  }

  users.push({
    email,
    password,
    userType: "admin",
  });

  res.status(200).send("User created successfully");
});

router.post("/signin", function (req: CustomRequest, res: Response) {
  const body = req.body;
  const email = body["email"];
  const password = body["password"];

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).send("User does not exist");
  }

  if (user.password !== password) {
    return res.status(401).send("Invalid password");
  }

  if (user.userType !== "admin") {
    return res.status(401).send("Unauthorized");
  }

  jwt.sign(
    { email, userType: "admin" },
    secret,
    (error: Error | null, token: string | undefined) => {
      if (error) {
        return res.status(500).send("Internal server error");
      }
      res.status(200).send({ token });
    }
  );
});

router.post(
  "/questions",
  adminAuthorization,
  function (req: CustomRequest, res: Response) {
    const body = req.body;
    const title = body["title"];
    const description = body["description"];
    const testCases = body["testcases"];
    QUESTIONS.push({
      id: uuid(),
      title,
      description,
      testCases,
    });
    console.log(QUESTIONS);
    res.status(200).send("Question created successfully");
  }
);

export default router;
