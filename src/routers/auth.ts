import express from "express";
import signupHandler from "../handlers/signup";

const authRouter = express.Router();

authRouter.post("/signup", signupHandler);

export default authRouter;
