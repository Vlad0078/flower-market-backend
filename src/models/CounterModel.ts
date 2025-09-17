import mongoose, { Document } from "mongoose";

interface Counter {
  _id: string;
  seq: number;
}

const counterSchema = new mongoose.Schema<Counter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const CounterModel = mongoose.models.counters
  ? (mongoose.models.counters as mongoose.Model<Counter>)
  : mongoose.model<Counter>("counters", counterSchema);

export default CounterModel;
