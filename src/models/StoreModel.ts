import mongoose, { Document } from "mongoose";

interface StoreDocument extends Document {
  name: { uk: string; en: string };
  address: { uk: string; en: string };
  photo: string;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new mongoose.Schema<StoreDocument>(
  {
    name: {
      type: {
        uk: { type: String, required: true },
        en: { type: String, required: true },
      },
      required: true,
    },
    address: {
      type: {
        uk: { type: String, required: true },
        en: { type: String, required: true },
      },
      required: true,
    },
    photo: { type: String },
  },
  { timestamps: true }
);

const StoreModel =
  (mongoose.models.stores<StoreDocument> as mongoose.Model<StoreDocument>) ||
  mongoose.model<StoreDocument>("stores", storeSchema);

export default StoreModel;
