import { RequestHandler } from "express";
import OrderModel, { OrderDocument } from "../models/OrderModel";
import FlowerModel, { FlowerDocument } from "../models/FlowerModel";
import CounterModel from "../models/CounterModel";
import translationConfig from "../config/translationConfig";
import { fetchAndTranslateOrder } from "../services/orderService";

const defaultLang = translationConfig.defaultLang;

const getOrderById: RequestHandler<{}, {}, { userId: string }, { id: string }> = async (
  req,
  res
) => {
  const { id } = req.query;
  const token = res.locals.guestToken;

  const lang = req.headers["accept-language"]?.split(",")[0] || defaultLang;

  try {
    const order = await fetchAndTranslateOrder({
      findBy: { _id: id },
      lang,
    });

    res.setHeader("Content-Language", lang);
    res.status(200).json(order);
  } catch (error) {
    console.error("Could not get order:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not get order", token });
  }
};

const getOrderByOrderId: RequestHandler<
  { orderId: string },
  {},
  { userId: string },
  { id: string }
> = async (req, res) => {
  const userId = req.userId;
  const { orderId } = req.params;
  const token = res.locals.guestToken;

  const lang = req.headers["accept-language"]?.split(",")[0] || defaultLang;

  try {
    const order = await fetchAndTranslateOrder({
      findBy: { orderId },
      lang,
    });

    if (String(order.userId) !== userId) {
      res.status(403).json({ message: "You are not authorized to view this order", token });
    }

    res.setHeader("Content-Language", lang);
    res.status(200).json({ order });
  } catch (error) {
    console.error("Could not get order:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not get order", token });
  }
};

interface SaveOrderReqBody {
  userId: string;
  orderItems: { flowerId: string; qty: number }[];
  name: string;
  phone: string;
  email: string;
  address: string;
  timeZone: string;
}

const saveOrder: RequestHandler<{}, {}, SaveOrderReqBody> = async (req, res) => {
  const userId = req.userId;
  const { orderItems, name, email, phone, address, timeZone } = req.body;
  const token = res.locals.guestToken;

  try {
    const flowerIds = orderItems.map((item) => item.flowerId);

    // get actual prices
    const flowers = await FlowerModel.find(
      { _id: { $in: flowerIds } },
      { _id: 1, price: 1 }
    ).lean();

    let total = 0;

    const itemsWithPrices: { flowerId: string; qty: number; price: number }[] = [];

    for (const item of orderItems) {
      const flower = flowers.find((f) => f._id.toString() === item.flowerId);
      if (!flower) {
        return res.status(422).json({ message: `Flower not found: ${item.flowerId}`, token });
      }

      itemsWithPrices.push({ ...item, price: flower.price });
      total += flower.price * item.qty;
    }

    if (itemsWithPrices.length < 1) {
      return res.status(422).json({ message: "Empty cart", token });
    }

    // form an order
    const orderCounter = await CounterModel.findByIdAndUpdate(
      "orderId",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).lean();

    if (!orderCounter) throw new Error("Could not get order counter");

    const newOrder = new OrderModel({
      orderId: orderCounter.seq,
      userId,
      total,
      items: itemsWithPrices,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      customerTimezone: timeZone,
    });
    await newOrder.save();

    res.status(200).json({ message: "Order saved", orderId: newOrder.orderId, token });
  } catch (error) {
    console.error("Could not save order:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not save order", token });
  }
};

export { getOrderById, getOrderByOrderId, saveOrder };
