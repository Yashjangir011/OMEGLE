import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const isLogged = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    const decoded_data = jwt.verify(
      token,
      process.env.SECRET_CODE as string
    ) as any; // cast to any to skip strict typing

    if (!decoded_data) {
      return res.status(403).json({
        message: "Token expired or invalid",
      });
    }

    const user = await client.user.findUnique({
      where: { Email: decoded_data.email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    (req as any).USER = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Please login again",
    });
  }
};

export default isLogged;
