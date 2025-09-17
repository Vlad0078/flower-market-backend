import mongoose, { Document, ObjectId, Types } from "mongoose";

type UserRole = "guest" | "authorized" | "admin";

interface UserDocument extends Document {
  name: string;
  role: UserRole;
  email?: string;
	passwordHash?: string;
	favoriteFlowers: ObjectId[]
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true },
		role: { type: String, required: true, enum: ["guest", "authorized", "admin"] },
    email: String,
    passwordHash: String,
		favoriteFlowers: {type: [Types.ObjectId], default: [], ref: 'flowers'}
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.users<UserDocument> as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>("users", userSchema);

export default UserModel;
