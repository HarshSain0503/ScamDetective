export const calculateScore = (alerts) => {

    let score = 0;
    let reasons = [];

    // Invalid URL
    if (alerts.invalidURL) {
        score += 20;
        reasons.push("Invalid URL format");
    }

    // No HTTPS
    if (alerts.noHTTPS) {
        score += 10;
        reasons.push("Website does not use HTTPS encryption");
    }

    // IP address detection
    if (alerts.ipAddress) {
        score += 20;
        reasons.push("URL uses an IP address instead of a domain");
    }

    // Suspicious keywords
    if (alerts.suspiciousKeyword) {
        score += 15;
        reasons.push("Scam-related keywords detected on the website");
    }

    // Suspicious domain extensions
    if (alerts.suspiciousDomain) {
        score += 20;
        reasons.push("Risky domain extension detected");
    }

    // Suspicious subdomain
    if (alerts.suspiciousSubdomain) {
        score += 10;
        reasons.push("Suspicious subdomain structure detected");
    }

    // Long phishing URLs
    if (alerts.longURL) {
        score += 10;
        reasons.push("Unusually long URL detected (possible phishing attempt)");
    }

    // Domain age detection
    if (alerts.newDomain) {
        score += 15;
        reasons.push("Domain is newly registered (high scam risk)");
    }

    // User alert: payment request
    if (alerts.paymentAsked) {
        score += 20;
        reasons.push("Website requested payment or registration fee");
    }

    // User alert: personal information
    if (alerts.personalInfoAsked) {
        score += 15;
        reasons.push("Sensitive personal information requested");
    }

    // User alert: urgency pressure
    if (alerts.urgentOffer) {
        score += 10;
        reasons.push("Urgent job pressure detected");
    }

    let status = "Safe";

    if (score >= 60) {
        status = "Scam";
    }
    else if (score >= 30) {
        status = "Suspicious";
    }

    return {
        score,
        status,
        reasons
    };
};