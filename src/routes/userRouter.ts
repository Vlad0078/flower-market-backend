import { Router } from "express";
import { checkAuth } from "../controllers/userController";
import auth from "../middleware/auth";
const userRouter = Router();

userRouter.post("/auth", auth, checkAuth);

export default userRouter;
