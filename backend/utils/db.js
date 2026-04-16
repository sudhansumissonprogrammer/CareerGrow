import mongoose from "mongoose";

const connectDB = async (retries = 5, delayMs = 5000) => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL not found in environment variables");
  }

  let attempt = 0;

  while (attempt < retries) {
    attempt += 1;

    try {
      await mongoose.connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("Database connected successfully");
      return true;
    } catch (error) {
      console.error(
        `Database connection attempt ${attempt}/${retries} failed: ${error.message}`
      );
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  return false;
};

export const isDbConnected = () => {
  try {
    return mongoose.connection.readyState === 1;
  } catch (_error) {
    return false;
  }
};

export default connectDB;