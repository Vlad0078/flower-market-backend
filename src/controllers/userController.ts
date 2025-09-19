import { RequestHandler } from "express";
import UserModel from "../models/UserModel";
import * as jwt from "jsonwebtoken";

const checkAuth: RequestHandler = async (req, res) => {
  const { userId, userRole } = req;

  try {
    if (userId) {
      return res.status(200).json({ message: "User is authorized", userRole });
    }

    const guest = new UserModel({ name: "Guest", role: "guest" });
    await guest.save();

    const token = jwt.sign({ id: guest.id }, process.env.JWT_SECRET, { expiresIn: 3600 * 24 });

    req.userId = guest.id;

    res.status(200).json({ message: "Guest account created", token, userRole });
  } catch (error) {
    console.error("Could not create guest account:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not create guest account" });
  }
};

export { checkAuth };
