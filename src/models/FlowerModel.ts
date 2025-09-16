import mongoose, { Document, ObjectId, Types } from "mongoose";

interface FlowerDocument extends Document {
  storeId: ObjectId;
  name: { uk: string; en: string };
  description: { uk: string; en: string };
  photo: string[];
  price: number;
  stock: number;
}

const flowerSchema = new mongoose.Schema<FlowerDocument>(
  {
    storeId: { type: Types.ObjectId, ref: "stores", required: true, index: true },
    name: {
      type: {
        uk: { type: String, required: true },
        en: { type: String, required: true },
      },
      required: true,
    },
    description: {
      type: {
        uk: { type: String, required: true },
        en: { type: String, required: true },
      },
      required: true,
    },
    photo: { type: [String], required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);

const FlowerModel =
  (mongoose.models.flowers<FlowerDocument> as mongoose.Model<FlowerDocument>) ||
  mongoose.model<FlowerDocument>("flowers", flowerSchema);

export default FlowerModel;
