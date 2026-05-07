import Report from "../models/Report.js";
import Scan from "../models/Scan.js";

export const createReport = async (req, res) => {
    try {

        const { url, message } = req.body;

        if (!url || !message) {
            return res.status(400).json({
                error: "URL and message are required"
            });
        }


        // Save new report
        const newReport = await Report.create({ url, message });

        // Count total reports for this URL
        const reportCount = await Report.countDocuments({ url });
        await Scan.findOneAndUpdate(
            { url },
            { $set: { reportCount } },
            { sort: { createdAt: -1 } }  // update the latest scan
        );

        res.status(201).json({
            success: true,
            report: newReport,
            reportCount
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};


export const getReports = async (req, res) => {
    try {

        const reports = await Report.find().sort({ createdAt: -1 });

        res.json(reports);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};