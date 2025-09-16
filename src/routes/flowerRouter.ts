import { Router } from "express";
import { addFlower, getFlowers } from "../controllers/flowerController";

const flowerRouter = Router();

flowerRouter.get("/", getFlowers);
flowerRouter.post("/add", addFlower);

export default flowerRouter;
