import mongoose, { Document, ObjectId, Types } from "mongoose";

type OrderStatus =
  | "created"
  | "paid"
  | "ready-to-ship"
  | "shipping"
  | "shipped"
  | "received"
  | "cancelled";

interface OrderDocument extends Document {
  orderId: number;
  userId: ObjectId;
  items: { flowerId: ObjectId; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerTimezone: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    orderId: { type: Number, required: true, unique: true },
    userId: { type: Types.ObjectId, ref: "users", required: true },
    items: {
      type: [
        {
          flowerId: { type: Types.ObjectId, ref: "flowers", required: true },
          qty: { type: Number, required: true },
          price: { type: Number, required: true },
        },
      ],
      required: true,
    },
    total: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerTimezone: { type: String, required: true },
    status: {
      type: String,
      enum: ["created", "paid", "ready-to-ship", "shipping", "shipped", "received", "cancelled"],
      default: "created",
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.models.orders
  ? (mongoose.models.orders as mongoose.Model<OrderDocument>)
  : mongoose.model<OrderDocument>("orders", orderSchema);

export default OrderModel;
export { OrderDocument };
