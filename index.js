if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/*
Hey there Harkirat Singh!

I just wanted to take a moment to tell you how much I love your channel! 
You've been doing an amazing job and I wish you all the best for your future endeavors.

I must admit, I got a little too excited about joining your Discord group.
But, anyway, I had a great time working on my project and I did my best to make it as good as possible. 🙌

By the way, my Discord ID is Navi#0801, in case you'd like to connect with me there too. 😅

Once again, thanks for everything you do, and I hope to interact with you more in the future.

Take care and have a great day! 😊

Best regards,
Navi
www.navisureka.in

*/

const express = require("express");

const problemRouter = require("./src/routers/problemRouter");
const userRouter = require("./src/routers/userRouter");
const submissionRouter = require("./src/routers/submissionRouter");

require("./src/db/mongoose");

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(userRouter);
app.use(problemRouter);
app.use(submissionRouter);

app.get("/", async (req, res) => {
  res.send("Welcome to leetcode clone assignment by Harkirat Singh 💚");
});

app.all("*", (req, res, next) => {
  return next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).send(err.message);
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
