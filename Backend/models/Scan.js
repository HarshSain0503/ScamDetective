import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
    url: String,
    score: Number,
    status: String,
    reasons: [String],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Scan", scanSchema);