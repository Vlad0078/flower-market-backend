import { Router } from "express";
import { addStore, getStores } from "../controllers/storeController";

const storeRouter = Router();

storeRouter.get("/", getStores);
storeRouter.post("/add", addStore);

export default storeRouter;
