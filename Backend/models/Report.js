import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    url: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Report", reportSchema);