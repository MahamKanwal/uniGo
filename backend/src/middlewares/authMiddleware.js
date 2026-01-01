import jwt from "jsonwebtoken";
import userModal from "../features/users/userModel.js";

// =========================
// VERIFY TOKEN MIDDLEWARE
// =========================
export const protect = async (req, res, next) => {
  try {
    let token;
    // console.log("running protect middleware");
    // Token from header: Authorization: Bearer TOKEN
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    // Attach user to request (exclude password)
    const user = await userModal.findById(decoded.sub).select("-password");
    req.user = {_id: user._id, role: user.role};
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
    });
  }
};

// =========================
// ROLE BASED AUTHORIZATION
// =========================
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed`,
      });
    }
    next();
  };
