import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
    domain: String,
    reason: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Blacklist", blacklistSchema);