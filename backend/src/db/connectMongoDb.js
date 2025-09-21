import mongoose from "mongoose";

export const connectMongoDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONOGO_URI);
    console.log(`MongoDB connected successfully.`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectMongoDb;