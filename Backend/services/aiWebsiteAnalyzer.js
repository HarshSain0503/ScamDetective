import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import * as cheerio from "cheerio";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const analyzeWebsite = async (url) => {

    try {

        // Fetch website HTML
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const html = response.data;

        const $ = cheerio.load(html);

        // Remove non-visible elements
        $("script").remove();
        $("style").remove();
        $("noscript").remove();

        // Extract visible text
        const text = $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 3000);

        if (!text) {
            return {
                aiScore: 0,
                classification: "Safe",
                aiReasons: []
            };
        }

        const prompt = `
You are a cybersecurity AI detecting job scams.

Analyze the following website content.

Classify the website as one of:

Safe
Suspicious
Scam

Look for:
- Registration or application fees
- Unrealistic salaries
- Urgent hiring pressure
- Work from home scams
- Fake job guarantees

Return ONLY JSON.

Website Content:
${text}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0,
            messages: [
                { role: "user", content: prompt }
            ]
        });

        let aiResponse = completion.choices[0].message.content;

        aiResponse = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        try {

            const parsed = JSON.parse(aiResponse);

            return {
                aiScore: parsed.aiScore || 0,
                classification: parsed.classification || "Safe",
                aiReasons: parsed.aiReasons || []
            };

        } catch (err) {

            console.log("AI JSON parse error:", aiResponse);

            return {
                aiScore: 0,
                classification: "Suspicious",
                aiReasons: ["AI response could not be parsed"]
            };

        }

    } catch (error) {

        console.log("AI Website Analysis Failed:", error.message);

        if (error.code === "ENOTFOUND") {

            return {
                aiScore: 15,
                classification: "Suspicious",
                aiReasons: ["Domain does not exist"]
            };

        }

        return {
            aiScore: 0,
            classification: "Safe",
            aiReasons: []
        };

    }

};