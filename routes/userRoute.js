import express from "express";
import { registerUser } from "../controllers/userController.js";
const router = express.Router();

router.route("/register").post(registerUser);

export default router;
