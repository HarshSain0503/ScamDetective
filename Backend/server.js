import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import scanRoutes from "./routes/scanRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use("/api/scan", scanRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("ScamDetective API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});