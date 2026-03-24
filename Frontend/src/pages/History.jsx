import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {

    const [scans, setScans] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/scan");
                setScans(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchHistory();
    }, []);

    const filteredScans = scans.filter((scan) =>
        scan.url.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="pt-28 text-white px-10">

            <h1 className="text-4xl font-bold text-center mb-10">
                Scan History
            </h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search scanned URL..."
                className="w-full max-w-xl mx-auto block p-3 mb-10 rounded-lg bg-slate-900 border border-slate-700 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {filteredScans.length === 0 ? (
                <p className="text-center text-gray-400">
                    No matching URL found.
                </p>
            ) : (
                filteredScans.map((scan) => (
                    <div
                        key={scan._id}
                        className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6"
                    >

                        <p className="text-lg font-semibold break-all">
                            {scan.url}
                        </p>

                        <p
                            className={`font-bold mt-2 ${scan.status === "Safe"
                                ? "text-green-400"
                                : scan.status === "Suspicious"
                                    ? "text-yellow-400"
                                    : "text-red-400"
                                }`}
                        >
                            {scan.status} (Score: {scan.score})
                        </p>

                        {scan.reasons && (
                            <ul className="list-disc ml-6 mt-3 text-gray-300">
                                {scan.reasons.map((reason, i) => (
                                    <li key={i}>{reason}</li>
                                ))}
                            </ul>
                        )}

                        <p className="text-sm text-gray-400 mt-3">
                            {new Date(scan.createdAt).toLocaleString()}
                        </p>

                    </div>
                ))
            )}
        </div>
    );
}