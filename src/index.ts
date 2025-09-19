import express from "express";
import cors from "cors";
import storeRouter from "./routes/storeRouter";
import connectDB from "./config/mongodb";
import "dotenv/config";
import flowerRouter from "./routes/flowerRouter";
import orderRouter from "./routes/orderRouter";
import userRouter from "./routes/userRouter";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors({origin: process.env.CLIENT_URL,}));

app.use(express.json());

app.use("/store", storeRouter);
app.use("/flowers", flowerRouter);
app.use("/order", orderRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("API for Flower Market (test task for ElifTech)");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
