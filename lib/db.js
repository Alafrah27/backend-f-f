import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// const mongourl = process.env.MONGODBLOCAL;
const mongourl = process.env.MONGODBATLAS;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongourl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
