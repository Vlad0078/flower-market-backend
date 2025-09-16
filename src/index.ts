import express from "express";
import cors from "cors";
import storeRouter from "./routes/storeRouter";
import connectDB from "./config/mongodb";
import "dotenv/config";
import flowerRouter from "./routes/flowerRouter";
import addAssetStores from "./devScripts/addStores";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());

app.use(express.json());

app.use("/store", storeRouter);
app.use("/flowers", flowerRouter);

app.get("/", (req, res) => {
  res.send("API for Flower Market (test task for ElifTech)");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
