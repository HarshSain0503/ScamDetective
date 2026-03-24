import Scan from "../models/Scan.js";
import Report from "../models/Report.js";

export const getDashboardStats = async (req, res) => {

    try {

        const totalScans = await Scan.countDocuments();
        const scamCount = await Scan.countDocuments({ status: "Scam" });
        const suspiciousCount = await Scan.countDocuments({ status: "Suspicious" });
        const safeCount = await Scan.countDocuments({ status: "Safe" });
        const totalReports = await Report.countDocuments();

        res.json({
            totalScans,
            scamCount,
            suspiciousCount,
            safeCount,
            totalReports
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to load dashboard stats"
        });

    }

};