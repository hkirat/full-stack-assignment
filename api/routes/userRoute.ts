import { Router } from "express";
import { Secret } from "jsonwebtoken";
import { User } from "../types/user";
import jwt from "jsonwebtoken";

const router = Router();
const secret: Secret = "abcd4321";
const users: User[] = [];

router.post("/signup", (req, res) => {
  // Add logic to decode body
  // body should have email and password

  const body = req.body;
  const email = body["email"];
  const password = body["password"];

  if (users.find((user) => user.email === email)) {
    return res.status(400).send("User already exists");
  }

  users.push({
    email,
    password,
    userType: "user",
  });

  res.status(200).send("User created successfully");
});

router.post("/signin", function (req, res) {
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

  jwt.sign(
    { email, userType: user.userType },
    secret,
    (error: Error | null, token: string | undefined) => {
      if (error) {
        return res.status(500).send("Internal server error");
      }
      res.status(200).send({ token });
    }
  );
});

export default router;
