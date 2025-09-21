import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found", token });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// export const deleteNotification = async (req, res) => {
//   try {
//     const notificationId = req.params.id;
//     const userId = req.user._id;

//     const notification = await Notification.findById(notificationId);
//     if (!notification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }
//     if (notification.to.toString() !== userId.toString()) {
//       return res.status(403).json({
//         message: "You do not have permission to delete this notification",
//       });
//     }
//     await Notification.findByIdAndDelete(notificationId);
//     res.status(200).json({ message: "Notification deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting notification:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
