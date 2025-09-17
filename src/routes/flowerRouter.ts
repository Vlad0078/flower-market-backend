import { Router } from "express";
import { addFlower, addFlowerToFav, getFavoriteFlowers, getFlowers, getFlowersByIds } from "../controllers/flowerController";
import authUser from "../middleware/auth";

const flowerRouter = Router();

flowerRouter.get("/", getFlowers);
flowerRouter.post("/by-ids", getFlowersByIds);
flowerRouter.post("/add", addFlower);

flowerRouter.get("/favs", authUser, getFavoriteFlowers);
flowerRouter.post("/add-to-fav", authUser, addFlowerToFav);

export default flowerRouter;
