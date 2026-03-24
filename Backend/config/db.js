import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "scamdetective",
        });
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;