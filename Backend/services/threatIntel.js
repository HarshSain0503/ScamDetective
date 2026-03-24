import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const checkGoogleSafeBrowsing = async (url) => {

    try {

        const apiKey = process.env.GOOGLE_SAFE_API_KEY;

        const endpoint =
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

        const body = {
            client: {
                clientId: "scamdetective",
                clientVersion: "1.0"
            },
            threatInfo: {
                threatTypes: [
                    "MALWARE",
                    "SOCIAL_ENGINEERING",
                    "UNWANTED_SOFTWARE"
                ],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [
                    { url }
                ]
            }
        };

        const response = await axios.post(endpoint, body);

        if (response.data && response.data.matches) {

            return {
                unsafe: true,
                reason: "URL flagged by Google Safe Browsing (phishing or malware)"
            };

        }

        return { unsafe: false };

    } catch (error) {

        console.log("Safe Browsing check failed:", error.message);

        return { unsafe: false };

    }

};