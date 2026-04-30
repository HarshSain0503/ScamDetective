export const calculateScore = (alerts) => {

    let score = 0;
    let reasons = [];

    // -------- INVALID URL --------
    if (alerts.invalidURL) {
        score += 20;
        reasons.push(
            "Invalid URL format or domain does not exist"
        );
    }

    // -------- NO HTTPS --------
    if (alerts.noHTTPS) {
        score += 10;
        reasons.push(
            "Website does not use HTTPS encryption"
        );
    }

    // -------- IP ADDRESS --------
    if (alerts.ipAddress) {
        score += 20;
        reasons.push(
            "URL uses an IP address instead of a domain name"
        );
    }

    // -------- SUSPICIOUS DOMAIN --------
    if (alerts.suspiciousDomain) {
        score += 20;
        reasons.push(
            "Domain uses a risky or untrusted extension"
        );
    }

    // -------- SUSPICIOUS SUBDOMAIN --------
    if (alerts.suspiciousSubdomain) {
        score += 10;
        reasons.push(
            "Suspicious subdomain structure detected"
        );
    }

    // -------- LONG URL --------
    if (alerts.longURL) {
        score += 10;
        reasons.push(
            "Unusually long URL detected — possible phishing attempt"
        );
    }

    // -------- BRAND PHISHING --------
    if (alerts.brandPhishing) {
        score += 25;
        reasons.push(
            "Brand impersonation detected — fake domain mimicking a trusted brand"
        );
    }

    // -------- PHISHING PATTERN --------
    if (alerts.phishingPattern) {
        score += 20;
        reasons.push(
            "Phishing URL pattern detected — fake account or payment page"
        );
    }

    // -------- SCAM KEYWORDS WITH CATEGORIES --------
    if (alerts.suspiciousKeyword) {

        score += 15;

        const categoryMessages = {
            paymentFees:
                "Payment or fee requirement detected on website",
            earningClaims:
                "Unrealistic earning claims detected",
            fakeJobPromises:
                "Fake job guarantee or placement claims detected",
            urgencyPressure:
                "Urgency pressure tactics detected",
            workFromHome:
                "Suspicious work from home scheme detected",
            mlmSchemes:
                "MLM or pyramid scheme indicators detected",
            suspiciousContact:
                "Suspicious contact or payment method detected",
            hindiKeywords:
                "Hindi language scam keywords detected",
            govtJobScams:
                "Fake government job scam indicators detected",
            onlineWorkScams:
                "Online work scam pattern detected",
            investmentScams:
                "Investment scam indicators detected"
        };

        if (alerts.detectedKeywordCategories?.length > 0) {
            alerts.detectedKeywordCategories.forEach(category => {
                if (categoryMessages[category]) {
                    reasons.push(categoryMessages[category]);
                }
            });
        } else {
            reasons.push(
                "Scam related keywords detected on website"
            );
        }

    }

    // -------- DOMAIN AGE --------
    if (alerts.newDomain) {
        score += 15;
        reasons.push(
            "Domain is newly registered — high scam risk"
        );
    }

    // -------- USER ALERTS --------
    if (alerts.paymentAsked) {
        score += 20;
        reasons.push(
            "Website requested payment or registration fee"
        );
    }

    if (alerts.personalInfoAsked) {
        score += 15;
        reasons.push(
            "Sensitive personal information requested"
        );
    }

    if (alerts.urgentOffer) {
        score += 10;
        reasons.push(
            "Urgent job offer pressure detected"
        );
    }

    // -------- FINAL CLASSIFICATION --------
    let status = "Safe";

    if (score >= 60) {
        status = "Scam";
    } else if (score >= 30) {
        status = "Suspicious";
    }

    return {
        score,
        status,
        reasons
    };

};