import { Router } from "express";
import { getOrderById, getOrderByOrderId, saveOrder } from "../controllers/orderController";
import authUser from "../middleware/auth";

const orderRouter = Router();

orderRouter.get("/order_:orderId", authUser, getOrderByOrderId);
orderRouter.get("/single", authUser, getOrderById);
orderRouter.post("/save", authUser, saveOrder);

export default orderRouter;
