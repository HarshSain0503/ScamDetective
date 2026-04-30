import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        try {

            const res = await axios.post(
                "http://localhost:5000/api/admin/login",
                { password }
            );

            if (res.data.success) {
                setSuccess(true);
                localStorage.setItem("adminAuth", "true");
                setTimeout(() => navigate("/admin"), 1000);
            }

        } catch {
            setError("Incorrect password. Access denied.");
            setPassword("");
        } finally {
            setLoading(false);
        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center px-6"
            style={{ background: "#0f172a" }}>

            <div className="w-full max-w-sm">

                {/* Brand */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span className="text-blue-500 font-semibold text-sm tracking-widest">
                        SCAMDETECTIVE
                    </span>
                </div>

                {/* Card */}
                <div className="rounded-2xl overflow-hidden border border-slate-700"
                    style={{ background: "#1e293b" }}>

                    {/* Card Header */}
                    <div className="text-center py-8 px-8 border-b border-slate-700"
                        style={{ background: "#1a2744" }}>

                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-900"
                            style={{ background: "#1d3a6e" }}>
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>

                        <h1 className="text-lg font-semibold text-slate-100 mb-1">
                            Admin Portal
                        </h1>
                        <p className="text-xs text-slate-500">
                            Restricted access — authorized personnel only
                        </p>

                    </div>

                    {/* Card Body */}
                    <div className="p-7">
                        {/* Password Input */}
                        <label className="block text-xs text-slate-400 mb-2 tracking-wider">
                            ADMIN PASSWORD
                        </label>

                        <div className="relative mb-4">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="w-full pl-10 pr-4 py-3 rounded-lg text-slate-100 placeholder-slate-600 outline-none text-sm border border-slate-700 focus:border-blue-600"
                                style={{ background: "#0f172a" }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 mb-4 border border-red-900"
                                style={{ background: "#2d1515" }}>
                                <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                <span className="text-xs text-red-400">{error}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 mb-4 border border-green-900"
                                style={{ background: "#14291a" }}>
                                <svg className="w-3.5 h-3.5 text-green-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <span className="text-xs text-green-400">Access granted. Redirecting...</span>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            disabled={loading || success}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white text-sm font-medium transition disabled:opacity-60"
                            style={{ background: success ? "#16a34a" : "#2563eb" }}
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : success ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    Access Granted
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10 17 15 12 10 7"></polyline>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                    </svg>
                                    Login to Dashboard
                                </>
                            )}
                        </button>

                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs mt-5" style={{ color: "#334155" }}>
                    ScamDetective — AI Cybersecurity Platform v1.0
                </p>

            </div>
        </div>
    );
}