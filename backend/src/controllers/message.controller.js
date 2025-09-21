import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";


export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    if (!filteredUsers || filteredUsers.length === 0) {
      return res.status(404).json({ message: "No other users found" });
    }

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users for getUserForSidebar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: new mongoose.Types.ObjectId(senderId), receiverId: new mongoose.Types.ObjectId(userToChatId) },
        { senderId: new mongoose.Types.ObjectId(userToChatId), receiverId: new mongoose.Types.ObjectId(senderId) },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name profilePicture")
      .populate("receiverId", "name profilePicture");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      text,
      senderId,
      receiverId,
      image: imageUrl,
    });

    await newMessage.save();
    // todo: Emit the new message to the receiver via WebSocket or similar
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
