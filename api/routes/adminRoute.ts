import { Router } from "express";
import { adminSignin, adminSingup } from "../controllers/adminController";

const router = Router();

router.post("/signup", adminSingup);
router.post("/signin", adminSignin);

export default router;
