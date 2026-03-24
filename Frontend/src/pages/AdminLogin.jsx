import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {

        try {

            const res = await axios.post(
                "http://localhost:5000/api/admin/login",
                { password }
            );

            if (res.data.success) {

                localStorage.setItem("adminAuth", "true");

                navigate("/admin");

            }

        } catch {

            setError("Incorrect password");

        }

    };

    return (

        <div className="pt-40 flex justify-center">

            <div className="bg-slate-800 p-10 rounded-xl w-96 text-center">

                <h1 className="text-3xl font-bold mb-6">
                    Admin Login
                </h1>

                <input
                    type="password"
                    placeholder="Enter Admin Password"
                    className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
                >
                    Login
                </button>

                {error && (
                    <p className="text-red-400 mt-4">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
}