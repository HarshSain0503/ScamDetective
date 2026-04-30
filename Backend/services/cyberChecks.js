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
        brandPhishing: false,
        phishingPattern: false,
        detectedKeywordCategories: []
    };

    try {

        // Auto add protocol
        if (!url.startsWith("http")) {
            url = "https://" + url;
        }

        const parsed = new URL(url);
        const hostname = parsed.hostname.toLowerCase();

        // -------- HTTPS CHECK --------
        if (!url.startsWith("https://")) {
            alerts.noHTTPS = true;
        }

        // -------- IP ADDRESS DETECTION --------
        const ipRegex = /(\d{1,3}\.){3}\d{1,3}/;
        if (ipRegex.test(hostname)) {
            alerts.ipAddress = true;
        }

        // -------- TRUSTED DOMAIN WHITELIST --------
        // Only these extensions are considered safe
        const safeDomains = [
            ".com", ".org", ".edu",
            ".gov", ".net", ".io",
            ".co.in", ".ac.in",
            ".co.uk", ".org.uk",
            ".gov.in", ".nic.in",
            ".org.in", ".co"
        ];

        if (!safeDomains.some(ext => hostname.endsWith(ext))) {
            alerts.suspiciousDomain = true;
        }

        // -------- LONG URL DETECTION --------
        if (url.length > 100) {
            alerts.longURL = true;
        }

        // -------- SUSPICIOUS SUBDOMAIN DETECTION --------
        const parts = hostname.split(".");
        if (parts.length > 3) {
            alerts.suspiciousSubdomain = true;
        }

        // -------- NUMBERS IN DOMAIN --------
        if (/\d/.test(hostname)) {
            alerts.suspiciousDomain = true;
        }

        // -------- URL SHORTENER DETECTION + FOLLOW REDIRECT --------
        const shorteners = [
            "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly",
            "tiny.cc", "is.gd", "rb.gy", "cutt.ly", "shorturl.at",
            "rebrand.ly", "buff.ly", "short.io", "bl.ink", "snip.ly",
            "ift.tt", "dlvr.it", "clck.ru", "adf.ly", "tny.im",
            "bc.vc", "sh.st", "ouo.io", "za.gl", "chilp.it",
            "s.id", "qr.ae", "su.pr", "lnkd.in", "wp.me",
            "ow.ly", "j.mp", "budurl.com", "cli.gs", "ff.im",
            "mcaf.ee", "u.to", "v.gd", "x.co", "tr.im"
        ];

        const trustedShorteners = [
            "youtu.be", "amzn.to", "fb.me", "g.co"
        ];

        const isShortener =
            shorteners.some(s => hostname.includes(s)) &&
            !trustedShorteners.some(t => hostname.includes(t));

        if (isShortener) {

            alerts.suspiciousDomain = true;

            // Follow redirect to get real URL
            try {

                const redirectResponse = await axios.get(url, {
                    maxRedirects: 5,
                    timeout: 8000,
                    headers: { "User-Agent": "Mozilla/5.0" }
                });

                const finalURL =
                    redirectResponse.request?.res?.responseUrl ||
                    redirectResponse.request?.responseURL;

                if (finalURL && finalURL !== url) {
                    console.log("Shortener redirected to:", finalURL);
                    url = finalURL;
                    const redirectParsed = new URL(finalURL);
                    const redirectHostname =
                        redirectParsed.hostname.toLowerCase();

                    // Recheck the real URL
                    if (!safeDomains.some(
                        ext => redirectHostname.endsWith(ext)
                    )) {
                        alerts.suspiciousDomain = true;
                    }

                }

            } catch (redirectError) {
                console.log(
                    "Redirect follow failed:",
                    redirectError.message
                );
            }

        }

        // -------- BRAND PHISHING DETECTION (WHITELIST) --------
        const legitimateDomains = {

            // Payment and Finance
            "paypal": ["paypal.com", "paypal.me"],
            "paytm": ["paytm.com"],
            "phonepe": ["phonepe.com"],
            "razorpay": ["razorpay.com"],
            "stripe": ["stripe.com"],
            "hdfc": ["hdfcbank.com", "hdfc.com"],
            "sbi": ["sbi.co.in", "onlinesbi.com"],
            "icici": ["icicibank.com"],
            "axis": ["axisbank.com"],
            "kotak": ["kotak.com", "kotakbank.com"],

            // Big Tech
            "google": [
                "google.com", "google.co.in",
                "googleapis.com", "google.org"
            ],
            "microsoft": [
                "microsoft.com", "live.com",
                "outlook.com", "azure.com"
            ],
            "apple": ["apple.com", "icloud.com"],
            "amazon": [
                "amazon.com", "amazon.in",
                "amazonaws.com", "amzn.com"
            ],
            "facebook": [
                "facebook.com", "fb.com",
                "messenger.com"
            ],
            "instagram": ["instagram.com"],
            "whatsapp": ["whatsapp.com", "whatsapp.net"],
            "twitter": ["twitter.com", "x.com"],
            "linkedin": ["linkedin.com"],
            "netflix": ["netflix.com"],
            "youtube": ["youtube.com", "youtu.be"],
            "spotify": ["spotify.com"],
            "adobe": ["adobe.com"],
            "zoom": ["zoom.us", "zoom.com"],
            "slack": ["slack.com"],
            "dropbox": ["dropbox.com"],

            // Job Portals
            "naukri": ["naukri.com"],
            "indeed": ["indeed.com", "indeed.co.in"],
            "glassdoor": ["glassdoor.com", "glassdoor.co.in"],
            "internshala": ["internshala.com"],
            "monster": ["monster.com", "monsterindia.com"],
            "shine": ["shine.com"],
            "freshersworld": ["freshersworld.com"],
            "upwork": ["upwork.com"],
            "fiverr": ["fiverr.com"],
            "freelancer": ["freelancer.com"],
            "toptal": ["toptal.com"],
            "timesjobs": ["timesjobs.com"],
            "foundit": ["foundit.in"],

            // E-commerce
            "flipkart": ["flipkart.com"],
            "myntra": ["myntra.com"],
            "snapdeal": ["snapdeal.com"],
            "meesho": ["meesho.com"],
            "ebay": ["ebay.com", "ebay.in"],
            "swiggy": ["swiggy.com"],
            "zomato": ["zomato.com"],

            // IT Companies
            "infosys": ["infosys.com"],
            "wipro": ["wipro.com"],
            "tcs": ["tcs.com"],
            "hcl": ["hcltech.com", "hcl.com"],
            "accenture": ["accenture.com"],
            "cognizant": ["cognizant.com"],
            "capgemini": ["capgemini.com"],
            "ibm": ["ibm.com"],
            "oracle": ["oracle.com"],
            "salesforce": ["salesforce.com"],

            // Education
            "coursera": ["coursera.org"],
            "udemy": ["udemy.com"],
            "byju": ["byjus.com"],
            "unacademy": ["unacademy.com"],
            "vedantu": ["vedantu.com"],

            // Cloud and Hosting
            "github": ["github.com", "githubusercontent.com"],
            "gitlab": ["gitlab.com"],
            "netlify": ["netlify.com", "netlify.app"],
            "vercel": ["vercel.com", "vercel.app"],

            // Telecom
            "jio": ["jio.com"],
            "airtel": ["airtel.in", "airtel.com"],
            "vodafone": ["vodafone.in", "vodafone.com"],
            "bsnl": ["bsnl.co.in"]

        };

        let brandPhishingDetected = false;

        for (const [brand, trustedDomains] of
            Object.entries(legitimateDomains)) {

            if (hostname.includes(brand)) {

                const isTrusted = trustedDomains.some(
                    trusted =>
                        hostname === trusted ||
                        hostname.endsWith("." + trusted)
                );

                if (!isTrusted) {
                    brandPhishingDetected = true;
                    break;
                }

            }

        }

        if (brandPhishingDetected) {
            alerts.brandPhishing = true;
            alerts.suspiciousDomain = true;
        }

        // -------- PHISHING URL PATTERN DETECTION --------
        const phishingPatterns = [

            // Account verification
            "verify-account", "verify-email",
            "verify-identity", "verify-phone",
            "account-verify", "email-verify",

            // Login patterns
            "secure-login", "login-update",
            "login-verify", "login-confirm",
            "signin-verify", "signin-secure",
            "signin-update",

            // Account update
            "update-account", "account-update",
            "update-profile", "update-info",
            "update-details", "update-payment",
            "update-billing", "update-credentials",

            // Password
            "confirm-password", "reset-password",
            "change-password", "password-reset",
            "password-change", "password-confirm",
            "password-update", "forgot-password",

            // Security alerts
            "security-alert", "security-warning",
            "security-check", "security-verify",
            "security-update", "unusual-activity",
            "suspicious-activity", "unauthorized-access",

            // Account status
            "account-suspended", "account-blocked",
            "account-locked", "account-disabled",
            "account-restricted", "account-limited",
            "account-deactivated", "account-expired",

            // Payment
            "payment-required", "payment-pending",
            "payment-failed", "payment-update",
            "payment-verify", "invoice-pending",
            "billing-update", "card-update",
            "card-verify",

            // Confirmation
            "confirm-identity", "confirm-account",
            "confirm-email", "confirm-details",
            "confirm-info", "confirmation-required",

            // KYC and identity
            "kyc-update", "kyc-verify",
            "kyc-pending", "identity-proof",
            "aadhar-verify", "pan-verify",
            "document-verify", "document-upload",

            // Prize and reward
            "you-won", "winner-claim",
            "claim-reward", "claim-prize",
            "free-reward", "bonus-claim",
            "cashback-claim", "lottery-winner",
            "congratulations-winner",

            // Urgency
            "act-now", "action-required",
            "immediate-action", "urgent-action",
            "last-chance", "expire-soon",
            "expiring-today", "limited-time",

            // Job scam specific
            "job-offer-confirm", "offer-letter-download",
            "joining-fee", "training-fee",
            "registration-confirm", "application-fee",
            "interview-fee", "placement-fee",

            // OTP
            "otp-verify", "otp-confirm",
            "enter-otp", "validate-otp",

            // Refund
            "refund-claim", "refund-process",
            "money-back", "cashback-process",

            // Support scam
            "tech-support", "helpdesk-verify",
            "support-ticket-urgent",
            "customer-support-verify"

        ];

        if (phishingPatterns.some(
            p => url.toLowerCase().includes(p)
        )) {
            alerts.suspiciousKeyword = true;
            alerts.phishingPattern = true;
        }

        // -------- COMPREHENSIVE SCAM KEYWORD DETECTION --------
        const suspiciousKeywords = {

            paymentFees: [
                "registration fee", "processing fee",
                "application fee", "joining fee",
                "training fee", "security deposit",
                "refundable deposit", "interview fee",
                "placement fee", "enrollment fee",
                "activation fee", "membership fee",
                "verification fee", "documentation fee",
                "kit fee", "starter kit fee",
                "pay to work", "invest to earn",
                "deposit required", "advance payment",
                "upfront payment", "initial payment"
            ],

            earningClaims: [
                "earn money", "easy money",
                "make money fast", "make money online",
                "earn from home", "earn daily",
                "earn weekly", "guaranteed income",
                "guaranteed earnings", "guaranteed salary",
                "guaranteed profit", "guaranteed returns",
                "passive income", "unlimited earning",
                "unlimited income", "high salary",
                "attractive salary", "handsome salary",
                "earn lakhs", "earn thousands daily",
                "double your income", "financial freedom"
            ],

            fakeJobPromises: [
                "guaranteed job", "guaranteed placement",
                "100% placement", "immediate joining",
                "instant hiring", "direct joining",
                "on spot selection", "same day offer",
                "instant offer letter",
                "no interview required",
                "no experience required",
                "no qualification required",
                "freshers welcome", "anyone can apply",
                "housewife can apply",
                "work at your convenience"
            ],

            urgencyPressure: [
                "urgent hiring", "urgent requirement",
                "urgently required",
                "immediate requirement",
                "limited seats", "limited vacancy",
                "few seats left", "hurry up",
                "last date today", "closing soon",
                "offer expires", "limited time offer",
                "act now", "dont miss",
                "once in lifetime", "golden opportunity",
                "rare opportunity", "last chance"
            ],

            workFromHome: [
                "work from home", "work from anywhere",
                "work remotely", "home based job",
                "home based work", "online job from home",
                "part time from home", "be your own boss",
                "set your own hours", "work at home",
                "stay at home job", "laptop job",
                "mobile job", "whatsapp job",
                "online typing job", "online data entry",
                "copy paste job", "form filling job",
                "survey job", "captcha job",
                "ad posting job", "ad clicking job",
                "like and earn", "watch and earn",
                "refer and earn"
            ],

            mlmSchemes: [
                "multi level marketing", "mlm",
                "network marketing", "direct selling",
                "downline", "upline", "chain marketing",
                "pyramid scheme", "referral income",
                "refer friends earn", "join our team earn",
                "become distributor", "become reseller",
                "franchise opportunity",
                "business opportunity",
                "investment opportunity"
            ],

            suspiciousContact: [
                "whatsapp only", "contact on whatsapp",
                "call for details", "sms for details",
                "cash payment", "payment in cash",
                "google pay only", "paytm only",
                "upi payment", "direct bank transfer",
                "send money first", "pay first get job"
            ],

            hindiKeywords: [
                "ghar baithe", "ghar se kaam",
                "turant naukri", "pakki naukri",
                "guaranteed naukri", "rojgar guarantee",
                "kamai karo", "paisa kamao",
                "daily kamai", "registration karo",
                "fees do", "deposit karo"
            ],

            govtJobScams: [
                "government job guarantee",
                "sarkari naukri guarantee",
                "railway recruitment guarantee",
                "bank recruitment guarantee",
                "police recruitment guarantee",
                "government job without exam",
                "direct government job",
                "backdoor government job",
                "upsc guarantee", "ssc guarantee",
                "ibps guarantee"
            ],

            onlineWorkScams: [
                "data entry job", "typing job",
                "copy paste work", "form filling",
                "captcha solving", "image clicking",
                "product review job",
                "amazon flipkart work", "google task",
                "youtube task", "instagram task",
                "facebook task", "social media job",
                "photo editing job"
            ],

            investmentScams: [
                "invest and earn", "invest now",
                "double money", "triple money",
                "money doubling", "bitcoin job",
                "crypto job", "forex trading job",
                "share market job",
                "stock market guarantee",
                "trading guarantee",
                "risk free investment", "no risk",
                "100% profit", "assured returns",
                "fixed returns"
            ]

        };

        // Flatten all keywords
        const lowerURL = url.toLowerCase();

        Object.entries(suspiciousKeywords).forEach(
            ([category, keywords]) => {
                if (keywords.some(
                    word => lowerURL.includes(word)
                )) {
                    alerts.suspiciousKeyword = true;
                    if (!alerts.detectedKeywordCategories
                        .includes(category)) {
                        alerts.detectedKeywordCategories
                            .push(category);
                    }
                }
            }
        );

        // -------- FETCH WEBSITE CONTENT --------
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

            // Check page content for keywords
            Object.entries(suspiciousKeywords).forEach(
                ([category, keywords]) => {
                    if (keywords.some(
                        word => pageText.includes(word)
                    )) {
                        alerts.suspiciousKeyword = true;
                        if (!alerts.detectedKeywordCategories
                            .includes(category)) {
                            alerts.detectedKeywordCategories
                                .push(category);
                        }
                    }
                }
            );

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