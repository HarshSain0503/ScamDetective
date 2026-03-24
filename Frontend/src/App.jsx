import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Nav";
import Home from "./pages/Home";
import History from "./pages/History";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}