import { Router } from "express";
import { userSignin, userSignup } from "../controllers/userController";

const router = Router();

router.post("/signup", userSignup);
router.post("/signin", userSignin);

export default router;
