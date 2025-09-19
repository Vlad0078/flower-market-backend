import jwt from "jsonwebtoken";
import { RequestHandler, NextFunction } from "express";
import UserModel from "../models/UserModel";

const authUser: RequestHandler = async (req, res, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

      if (typeof tokenDecode === "object" && "id" in tokenDecode) {
        const user = await UserModel.findById(tokenDecode.id).lean();

        if (user) {
          req.userId = tokenDecode.id;
          req.userRole = user.role;
          return next();
        }
      }
    }

    if (req.path === "/auth" && req.baseUrl === "/user" && req.body?.createGuest === true) {
      return next();
    }

    res.status(401).json({ message: "Authentication failed" });
  } catch (error) {
    console.error("Authentication failed:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Authentication failed because of a server error" });
  }
};

export default authUser;
