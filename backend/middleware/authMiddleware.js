import jwt from "jsonwebtoken";
import { pool } from "../libs/database.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: "failed", message: "Unauthorized: No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from the database
    const userResult = await pool.query({
      text: `SELECT id, firstname, email FROM tbluser WHERE id = $1`,
      values: [decoded.userId],
    });

    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ status: "failed", message: "Unauthorized: User not found." });
    }

    // Attach user information to req.user
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ status: "failed", message: "Unauthorized: Invalid or expired token." });
    }

    console.error("Authentication error:", error);
    res.status(500).json({ status: "failed", message: "Internal Server Error." });
  }
};

export default authMiddleware;
