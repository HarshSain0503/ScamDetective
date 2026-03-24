import Blacklist from "../models/Blacklist.js";

export const checkBlacklist = async (url) => {

    try {

        const parsed = new URL(url);
        const domain = parsed.hostname;

        const entry = await Blacklist.findOne({ domain });

        if (entry) {

            return {
                blacklisted: true,
                reason: entry.reason || "Domain exists in scam blacklist"
            };

        }

        return { blacklisted: false };

    } catch (error) {

        return { blacklisted: false };

    }

};