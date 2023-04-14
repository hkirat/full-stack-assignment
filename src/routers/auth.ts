import express from "express";
import signupHandler from "../handlers/signup";
import loginHandler from "../handlers/login";

const authRouter = express.Router();

authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);

export default authRouter;
