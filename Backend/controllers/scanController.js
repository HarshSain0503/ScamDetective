import Scan from "../models/Scan.js";
import Report from "../models/Report.js";
import { runCyberChecks } from "../services/cyberChecks.js";
import { calculateScore } from "../services/scoringEngine.js";
import { checkDomainAge } from "../services/domainAgeCheck.js";
import { analyzeWebsite } from "../services/aiWebsiteAnalyzer.js";
import { checkGoogleSafeBrowsing } from "../services/threatIntel.js";
import { checkBlacklist } from "../services/blacklistCheck.js";

export const scanURL = async (req, res) => {

    let { url, alerts } = req.body;

    try {

        if (!url) {
            return res.status(400).json({ message: "URL required" });
        }

        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        // Cybersecurity checks
        const cyberAlerts = await runCyberChecks(url);

        const domainInfo = await checkDomainAge(url);

        const combinedAlerts = {
            ...cyberAlerts,
            ...alerts,
            newDomain: domainInfo.newDomain
        };

        const cyberResult = calculateScore(combinedAlerts);

        let cyberScore = cyberResult.score;

        let reasons = [...cyberResult.reasons];

        // AI analysis
        const aiResult = await analyzeWebsite(url);

        const aiScore = aiResult.aiScore || 0;

        reasons = [...reasons, ...(aiResult.aiReasons || [])];

        // Google Safe Browsing
        const safeBrowsing = await checkGoogleSafeBrowsing(url);

        if (safeBrowsing.unsafe) {
            cyberScore += 40;
            reasons.push(safeBrowsing.reason);
        }

        // Local blacklist
        const blacklist = await checkBlacklist(url);

        if (blacklist.blacklisted) {
            cyberScore += 50;
            reasons.push(blacklist.reason);
        }

        // Community reports
        const reportCount = await Report.countDocuments({ url });

        const reportScore = reportCount * 2;

        // Final score
        let finalScore = cyberScore + aiScore + reportScore;

        if (finalScore > 100) finalScore = 100;

        let status = "Safe";

        if (finalScore >= 60) status = "Scam";
        else if (finalScore >= 30) status = "Suspicious";

        const newScan = await Scan.create({
            url,
            score: finalScore,
            status,
            reasons
        });

        res.json({
            ...newScan.toObject(),
            domainAge: domainInfo.domainAge,
            aiClassification: aiResult.classification,
            reportCount,
            cyberScore,
            aiScore,
            reportScore,
            finalScore
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Scan failed"
        });

    }

};


export const getScans = async (req, res) => {

    try {

        const scans = await Scan.find().sort({ createdAt: -1 });

        res.json(scans);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch scans"
        });

    }

};