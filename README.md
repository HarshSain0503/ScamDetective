# ScamDetective

. AI-powered cybersecurity platform that detects fake job scam
. websites using multi-layer threat analysis.\

# Live Demo

. "https://scamdetective.netlify.app"

# Problem Statement

Job scams are increasing in India. Thousands of job seekers lose
money to fake portals that charge registration fees and steal
personal data. ScamDetective instantly analyzes any URL and
detects if it is a scam.

# Architecture

![Architecture](screenshots/architecture.png)

---

# How It Works

**Step 1** — User enters URL in search box

**Step 2** — Backend runs 5 detection layers:

| Layer | File                 | Purpose                   |
| ----- | -------------------- | ------------------------- |
| 1     | cyberChecks.js       | URL structure analysis    |
| 2     | aiWebsiteAnalyzer.js | OpenAI content inspection |
| 3     | threatIntel.js       | Google Safe Browsing API  |
| 4     | blacklistCheck.js    | MongoDB blacklist lookup  |
| 5     | domainAgeCheck.js    | WHOIS domain age check    |

**Step 3** — Scoring engine calculates risk:
Score 0-29 → ✅ Safe
Score 30-59 → ⚠️ Suspicious
Score 60+ → 🔴 Scam

**Step 4** — Result saved to MongoDB and shown to user

## Detection Layers

### Layer 1: Cybersecurity Engine

| Check                   | Score Added |
| ----------------------- | ----------- |
| No HTTPS                | +10         |
| IP address used         | +20         |
| Risky domain extension  | +20         |
| Long URL                | +10         |
| Suspicious subdomain    | +10         |
| Brand phishing detected | +25         |
| URL shortener found     | +20         |
| Phishing URL pattern    | +20         |
| Scam keywords detected  | +15         |

### Layer 2: AI Content Analysis

Uses **OpenAI GPT-4o-mini** to read website content:

1. Fetch HTML with Axios
2. Extract text with Cheerio
3. Send to OpenAI GPT-4o-mini
4. AI detects scam patterns
5. Returns score + reasons

### Layer 3: Threat Intelligence

**Google Safe Browsing API** — same database used by Chrome:

- Detects MALWARE
- Detects SOCIAL_ENGINEERING
- Detects UNWANTED_SOFTWARE
- Score added if flagged: **+40**

### Layer 4: Blacklist Database

Checks against local MongoDB blacklist:

- User reported domains
- Admin verified scam sites
- Score added if found: **+50**

### Layer 5: Domain Age Check

**WHOIS lookup** checks domain registration date:

- Domain under 30 days old = High Risk
- Score added: **+15**
- Scam sites are always newly created

# Malware Analysis Methodology

ScamDetective uses the **same methodology** as
professional malware analysis:

| Malware Analysis    | ScamDetective Equivalent    |
| ------------------- | --------------------------- |
| Static Analysis     | URL structure inspection    |
| Dynamic Analysis    | Live website content scan   |
| Sandbox Analysis    | OpenAI content analysis     |
| Threat Intelligence | Google Safe Browsing API    |
| IOC Extraction      | Domain, IP, pattern IOCs    |
| Risk Scoring        | 0-100 weighted threat score |
| Report Writing      | Detailed scan result report |

# Tech Stack

**Frontend:**

- React.js, Tailwind CSS, React Router, Axios

**Backend:**

- Node.js, Express.js, Mongoose, Cheerio

**AI and Security APIs:**

- OpenAI GPT-4o-mini
- Google Safe Browsing API v4

**Database:**

- MongoDB Atlas

**Deployment:**

- Netlify (Frontend)
- Render.com (Backend)
- MongoDB Atlas (Database)

# Security Features

. Admin panel with session authentication
. Environment variables for all API keys
. .env never committed to GitHub
. CORS configured for specific origins
. Input validation on all endpoints

# About This Project

**Type:** MCA Final Year Project  
**Domain:** Cybersecurity + Artificial Intelligence

Most MCA projects are basic CRUD apps.  
ScamDetective combines:
. Artificial Intelligence (OpenAI)
. Real Security APIs
. Multi-layer Detection Engine
. Threat Intelligence Integration
. Community Reporting System
