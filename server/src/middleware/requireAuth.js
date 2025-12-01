import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

export default async function requireAuth(req, res, next) {
  try {
    let token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1] ||
      req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize the user object
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user",
      });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
