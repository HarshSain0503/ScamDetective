import { useState } from "react";
import axios from "axios";

export default function Home() {

    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const [reportMessage, setReportMessage] = useState("");
    const [reportStatus, setReportStatus] = useState("");

    const [alerts, setAlerts] = useState({
        paymentAsked: false,
        personalInfoAsked: false,
        urgentOffer: false
    });

    // Scan Logic
    const handleCheck = async () => {

        if (!url) {
            setResult({ status: "Error", score: 0, message: "❗ Please enter a URL" });
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/scan",
                { url, alerts }
            );

            setResult(response.data);

        } catch (error) {

            console.error(error);

            setResult({
                status: "Error",
                score: 0,
                message: "⚠️ Error scanning URL"
            });

        } finally {
            setLoading(false);
        }
    };

    // Report Logic
    const handleReportSubmit = async () => {

        if (!reportMessage) {
            setReportStatus("❗ Please enter a report message");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:5000/api/report",
                {
                    url,
                    message: reportMessage
                }
            );

            if (response.data.success) {

                setReportStatus("✅ Report submitted successfully");
                setReportMessage("");

                const scanResponse = await axios.post(
                    "http://localhost:5000/api/scan",
                    { url, alerts }
                );

                setResult(scanResponse.data);

            }

        } catch (error) {

            console.error(error);
            setReportStatus("⚠️ Failed to submit report");

        }

    };

    return (

        <div className="pt-28">

            {/* HOME SECTION */}

            <section id="home" className="min-h-[40vh] flex flex-col justify-center items-center text-center px-6">

                <h1 className="text-5xl md:text-5xl font-bold mb-10">
                    AI-Powered Free Job and Internship Scam Detector
                </h1>

                <p className="text-gray-200 max-w-4xl text-xl">
                    ScamDetective protects students and job seekers from fake job and internship scams using advanced
                    cybersecurity analysis and intelligent detection algorithms to ensure every opportunity is safe.
                </p>

            </section>

            {/* ABOUT */}

            <section id="about" className="py-24 px-6 bg-slate-800 text-center">

                <h2 className="text-4xl font-bold mb-8">
                    About ScamDetective
                </h2>

                <p className="max-w-5xl mx-auto text-gray-200 text-lg font-semibold text-justify">
                    ScamDetective is a cybersecurity platform designed to protect students and job seekers from fraudulent job and internship opportunities available on the internet. With the rapid growth of online recruitment platforms, many scammers create fake job portals, phishing websites, and misleading internship offers to steal personal information or request illegal registration fees. ScamDetective helps users identify such threats before they become victims of online job scams.
                    <br /> <br />
                    The system analyzes suspicious job website URLs using multiple cybersecurity detection techniques such as domain verification, suspicious keyword detection, HTTPS security checks, IP address detection, and domain age analysis. These techniques help identify common phishing patterns used by scammers. In addition, the platform uses AI-powered content analysis to examine the actual content of a website and detect scam indicators such as unrealistic salary promises, urgent hiring pressure, or requests for registration fees.
                    <br /> <br />
                    ScamDetective also integrates threat intelligence services such as Google Safe Browsing and blacklist checks to identify websites that are already reported as malicious. Furthermore, the platform includes a community reporting feature that allows users to report suspicious websites, helping build a collective database of potentially harmful domains.
                </p>

            </section>

            {/* SEARCH */}

            <section id="search" className="py-24 px-6 text-center">

                <h2 className="text-4xl font-bold mb-10">
                    Check Job Website
                </h2>

                <div className="max-w-3xl mx-auto bg-slate-800 border border-slate-700 p-10 rounded-2xl shadow-2xl">

                    <input
                        type="text"
                        placeholder="Enter job website URL"
                        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    {/* Scam Indicators */}

                    <div className="mt-6 text-left text-gray-200">

                        <p className="font-semibold mb-3 text-gray-100 text-lg">
                            Scam Indicators
                        </p>

                        <label className="block mb-2 text-gray-300 text-lg font-semibold">
                            <input
                                type="checkbox"
                                className="mr-2"
                                onChange={(e) =>
                                    setAlerts({ ...alerts, paymentAsked: e.target.checked })
                                }
                            />
                            Did the website ask for any payment or registration fee?
                        </label>

                        <label className="block mb-2 text-gray-300 text-lg font-semibold">
                            <input
                                type="checkbox"
                                className="mr-2"
                                onChange={(e) =>
                                    setAlerts({ ...alerts, personalInfoAsked: e.target.checked })
                                }
                            />
                            Did they ask for sensitive personal information?
                        </label>

                        <label className="block mb-2 text-gray-300 text-lg font-semibold">
                            <input
                                type="checkbox"
                                className="mr-2"
                                onChange={(e) =>
                                    setAlerts({ ...alerts, urgentOffer: e.target.checked })
                                }
                            />
                            Did they pressure you with an urgent job offer?
                        </label>

                    </div>

                    <button
                        onClick={handleCheck}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition text-xl p-3 rounded-lg font-bold"
                    >
                        {loading ? "Analyzing..." : "Analyze"}
                    </button>

                    {/* RESULT */}

                    {result && (

                        <div className="mt-6 text-lg font-semibold">

                            <p
                                className={`text-xl ${result.status === "Safe"
                                    ? "text-green-400"
                                    : result.status === "Suspicious"
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                    }`}
                            >
                                {result.status} (Score: {result.score})
                            </p>

                            {result.reportCount > 0 && (
                                <p className="text-red-400 mt-2 font-semibold">
                                    ⚠️ {result.reportCount} users reported this website as scam
                                </p>
                            )}

                            {/* Risk Breakdown */}

                            {result.cyberScore !== undefined && (

                                <div className="mt-4 text-left text-gray-300">

                                    <p>Cybersecurity Risk: {result.cyberScore}</p>
                                    <p>AI Risk: {result.aiScore}</p>
                                    <p>Community Reports Risk: {result.reportScore}</p>

                                </div>

                            )}

                            {/* Risk Meter */}

                            <div className="mt-4 w-full bg-gray-700 rounded-full h-4">

                                <div
                                    className={`h-4 rounded-full transition-all duration-500 ${result.score < 30
                                        ? "bg-green-500"
                                        : result.score < 60
                                            ? "bg-yellow-400"
                                            : "bg-red-500"
                                        }`}
                                    style={{ width: `${result.score}%` }}
                                ></div>

                            </div>

                            {/* Detection Reasons */}

                            {result.reasons && result.reasons.length > 0 && (

                                <div className="mt-5 text-left">

                                    <p className="font-semibold mb-2 text-gray-200">
                                        Detection Reasons
                                    </p>

                                    <ul className="list-disc ml-6 text-gray-300">

                                        {result.reasons.map((reason, index) => (

                                            <li key={index}>
                                                {reason}
                                            </li>

                                        ))}

                                    </ul>

                                </div>

                            )}

                        </div>

                    )}

                </div>

            </section>

            {/* DETECTION TECHNOLOGY */}

            <section id="result" className="py-24 px-6 bg-slate-800 text-center">

                <h2 className="text-4xl font-bold mb-12">
                    Detection Technology
                </h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold mb-3">URL Validation</h3>
                        <p className="text-gray-300 text-md font-semibold">
                            Ensures the submitted link follows a legitimate URL structure.
                        </p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold mb-3">HTTPS Security Check</h3>
                        <p className="text-gray-300 text-md font-semibold">
                            Verifies whether the website uses secure HTTPS encryption.
                        </p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold mb-3">Keyword Analysis</h3>
                        <p className="text-gray-300 text-md font-semibold">
                            Detects suspicious keywords often used in job scams.
                        </p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold mb-3">IP Address Detection</h3>
                        <p className="text-gray-300 text-md font-semibold">
                            Flags URLs that use direct IP addresses instead of domains.
                        </p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold mb-3">Suspicious Domain Detection</h3>
                        <p className="text-gray-300 text-md font-semibold">
                            Identifies risky domain extensions commonly used by scam websites.
                        </p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold mb-3">Risk Scoring Engine</h3>
                        <p className="text-gray-300 text-md font-semibold">
                            Combines cybersecurity indicators and user alerts to classify the website.
                        </p>
                    </div>

                </div>

            </section>

            {/* REPORT */}

            <section id="report" className="py-24 px-6 text-center">

                <h2 className="text-4xl font-bold mb-10">
                    Report a Scam
                </h2>

                <div className="max-w-xl mx-auto bg-slate-800 border border-slate-700 p-10 rounded-2xl shadow-2xl">

                    <textarea
                        placeholder="Report suspicious job website"
                        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 outline-none text-md font-bold text-gray-400"
                        value={reportMessage}
                        onChange={(e) => setReportMessage(e.target.value)}
                    />

                    <button
                        onClick={handleReportSubmit}
                        className="w-full mt-4 bg-red-600 hover:bg-red-700 transition p-3 rounded-lg font-semibold"
                    >
                        Submit Report
                    </button>

                    {reportStatus && (
                        <div className="mt-4 text-lg font-semibold">
                            {reportStatus}
                        </div>
                    )}

                </div>

            </section>

        </div>
    );
}