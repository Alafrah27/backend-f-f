import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/User.model.js";

dotenv.config();
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    // Debugging line

    if (!token) {
      return res
        .status(401)
        .json({ message: "your are not logged  try again" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKENSECERTKEY); // Check for typo here
    } catch (err) {
      console.log("JWT verification error:", err.message); // Catch token verification errors
      return res.status(401).json({ message: "you are not authorized" });
    }

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const isAdminUser = async (req, res, next) => {
  try {
    // Check if the user exists and has admin rights
    if (req.user && req.user.isAdmin === "admin") {
      // Assuming isAdmin is a Boolean
      return next(); // Proceed if user is admin
    } else {
      return res.status(403).json({ message: "You are not an admin" });
    }
  } catch (error) {
    console.log("Error in isAdmin middleware:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
