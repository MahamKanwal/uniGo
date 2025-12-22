import mongoose from "mongoose";
import _config from "./config.js";

const connectDb = async () => {
  try {
    await mongoose.connect(_config.mongo_url);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};

export default connectDb;
