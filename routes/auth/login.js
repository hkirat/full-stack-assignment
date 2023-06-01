const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { USERS } = require('../../index');

const generateRandomToken = (length) =>
  crypto.randomBytes(length).toString("hex");

router.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password

  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array

  const userExits = USERS.some((user) => user.email === email);

  if (!userExits) {
    // User not found
    res.sendStatus(401);
    return;
  }
  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client

  if (!userExits === password) {
    res.sendStatus(401);
  }

  // If the password is the same, return back 200 status code to the client
  res.send(200);

  // Also send back a token (any random string will do for now)

  const token = generateRandomToken(32);
  res.send(token);
});

module.exports = router;
