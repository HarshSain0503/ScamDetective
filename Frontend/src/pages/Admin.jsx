import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

export default function Admin() {

    const [stats, setStats] = useState(null);

    const navigate = useNavigate();

    const token = localStorage.getItem("adminToken");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const res = await axios.get(
                    "http://localhost:5000/api/admin/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setStats(res.data);

            } catch (error) {

                console.log("Admin session invalid", error);

                localStorage.removeItem("adminToken");

                navigate("/admin-login");

            }

        };

        loadDashboard();

    }, [navigate, token]);


    const logout = async () => {

        try {

            await axios.post(
                "http://localhost:5000/api/admin/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

        } catch (error) {
            console.log("Logout error", error);
        }

        localStorage.removeItem("adminToken");

        navigate("/admin-login");

    };


    if (!stats)
        return (
            <div className="pt-32 text-center text-xl">
                Loading Dashboard...
            </div>
        );


    const chartData = {
        labels: [
            "Safe",
            "Suspicious",
            "Scam"
        ],
        datasets: [
            {
                label: "Website Status",
                data: [
                    stats.safeCount,
                    stats.suspiciousCount,
                    stats.scamCount
                ],
                backgroundColor: [
                    "#22c55e",
                    "#facc15",
                    "#ef4444"
                ],
                borderWidth: 2
            }
        ]
    };


    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "white",
                    font: {
                        size: 18,
                        weight: "bold"
                    },
                    padding: 20
                }
            },
            tooltip: {
                bodyFont: {
                    size: 16
                },
                titleFont: {
                    size: 18
                }
            }
        }
    };


    return (

        <div className="pt-32 px-6 pb-10 relative">

            <button
                onClick={logout}
                className="absolute top-32 right-8 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
                Logout
            </button>

            <h1 className="text-4xl font-bold text-center mb-12">
                Admin Dashboard
            </h1>

            {/* Stats Cards */}

            <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">

                <div className="bg-slate-800 p-6 rounded-xl text-center">
                    <h2 className="text-2xl font-bold">
                        {stats.totalScans}
                    </h2>
                    <p>Total Scans</p>
                </div>

                <div className="bg-red-900 p-6 rounded-xl text-center">
                    <h2 className="text-2xl font-bold">
                        {stats.scamCount}
                    </h2>
                    <p>Scam Websites</p>
                </div>

                <div className="bg-yellow-700 p-6 rounded-xl text-center">
                    <h2 className="text-2xl font-bold">
                        {stats.suspiciousCount}
                    </h2>
                    <p>Suspicious Websites</p>
                </div>

                <div className="bg-blue-900 p-6 rounded-xl text-center">
                    <h2 className="text-2xl font-bold">
                        {stats.totalReports}
                    </h2>
                    <p>User Reports</p>
                </div>

            </div>

            {/* Chart Section */}

            <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-xl">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Website Risk Distribution
                </h2>

                <div className="h-[420px]">

                    <Pie
                        data={chartData}
                        options={chartOptions}
                    />

                </div>

            </div>

        </div>

    );

}