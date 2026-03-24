import axios from "axios";
import * as cheerio from "cheerio";

export const runCyberChecks = async (url) => {

    const alerts = {
        invalidURL: false,
        noHTTPS: false,
        ipAddress: false,
        suspiciousKeyword: false,
        suspiciousDomain: false,
        longURL: false,
        suspiciousSubdomain: false,
        brandPhishing: false
    };

    try {

        // Ensure protocol exists
        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        const parsed = new URL(url);
        const hostname = parsed.hostname.toLowerCase();

        // HTTPS check
        if (!url.startsWith("https://")) {
            alerts.noHTTPS = true;
        }

        // IP address detection
        const ipRegex = /(\d{1,3}\.){3}\d{1,3}/;
        if (ipRegex.test(hostname)) {
            alerts.ipAddress = true;
        }

        // Suspicious domain extensions
        const riskyDomains = [
            ".xyz", ".top", ".work", ".buzz", ".click",
            ".gq", ".tk", ".ml", ".cf", ".ga"
        ];

        if (riskyDomains.some(ext => hostname.endsWith(ext))) {
            alerts.suspiciousDomain = true;
        }

        // Long URL
        if (url.length > 100) {
            alerts.longURL = true;
        }

        // Suspicious subdomain
        const parts = hostname.split(".");
        if (parts.length > 3) {
            alerts.suspiciousSubdomain = true;
        }

        // Numbers in domain
        if (/\d/.test(hostname)) {
            alerts.suspiciousDomain = true;
        }

        // URL shorteners
        const shorteners = ["bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly"];

        if (shorteners.some(s => hostname.includes(s))) {
            alerts.suspiciousDomain = true;
        }

        // Brand phishing detection
        const brands = [
            "paypal", "amazon", "google", "facebook",
            "microsoft", "apple", "netflix", "linkedin"
        ];

        if (brands.some(b => hostname.includes(b))) {

            if (
                !hostname.endsWith("paypal.com") &&
                !hostname.endsWith("amazon.com") &&
                !hostname.endsWith("google.com") &&
                !hostname.endsWith("facebook.com") &&
                !hostname.endsWith("microsoft.com") &&
                !hostname.endsWith("apple.com") &&
                !hostname.endsWith("netflix.com") &&
                !hostname.endsWith("linkedin.com")
            ) {
                alerts.brandPhishing = true;
                alerts.suspiciousDomain = true;
            }

        }

        // Phishing URL patterns
        const phishingPatterns = [
            "login-update", "verify-account",
            "secure-login", "update-account",
            "confirm-password"
        ];

        if (phishingPatterns.some(p => url.toLowerCase().includes(p))) {
            alerts.suspiciousKeyword = true;
        }

        // Scam keywords
        const suspiciousKeywords = [
            "registration fee", "processing fee", "earn money",
            "easy money", "quick job", "guaranteed job",
            "instant hiring", "urgent hiring", "limited seats",
            "no experience required", "work from home"
        ];

        const lowerURL = url.toLowerCase();

        if (suspiciousKeywords.some(word => lowerURL.includes(word))) {
            alerts.suspiciousKeyword = true;
        }

        // Fetch website content
        try {

            const response = await axios.get(url, {
                timeout: 8000,
                headers: { "User-Agent": "Mozilla/5.0" }
            });

            const html = response.data;

            const $ = cheerio.load(html);

            $("script").remove();
            $("style").remove();

            const pageText = $("body")
                .text()
                .toLowerCase()
                .replace(/\s+/g, " ");

            if (suspiciousKeywords.some(word => pageText.includes(word))) {
                alerts.suspiciousKeyword = true;
            }

        } catch (fetchError) {

            if (fetchError.code === "ENOTFOUND") {
                alerts.invalidURL = true;
            }

        }

    } catch (error) {

        alerts.invalidURL = true;

    }

    return alerts;
};