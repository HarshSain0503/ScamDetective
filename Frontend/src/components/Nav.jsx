import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../images/Logo.png";
import detective from "../images/Detective.png";

export default function Navbar() {

    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isInnerPage =
        location.pathname === "/history" ||
        location.pathname === "/admin" ||
        location.pathname === "/admin-login";

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (

        <nav className="fixed top-0 w-full z-30 bg-slate-950 border-b border-slate-300 shadow-lg">
            <div className="max-w-8xl mx-auto ml-4 px-4 h-20 nav:h-28 flex items-center justify-between">

                {/* Logo + Title */}
                <Link
                    to="/"
                    onClick={() => window.scrollTo({ top: 10, behavior: "smooth" })}
                    className="flex items-center"
                >
                    <div className="w-20 h-20 nav:w-24 nav:h-24 rounded-full overflow-hidden">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex items-center">
                        <span className="text-2xl nav:text-4xl font-bold text-blue-500">
                            Scam
                        </span>

                        <img
                            src={detective}
                            alt="Detective"
                            className="w-12 h-12 nav:w-16 nav:h-16 object-contain -mx-2"
                        />

                        <span className="text-2xl nav:text-4xl font-bold text-blue-500">
                            Detective
                        </span>
                    </div>
                </Link>


                {/* Desktop Navigation */}
                <div className="hidden nav:flex items-center gap-8 text-xl text-gray-300 font-bold mr-12">

                    {isInnerPage ? (
                        <>
                            <Link to="/#home" className="hover:text-blue-400">Home</Link>
                            <Link to="/#about" className="hover:text-blue-400">About</Link>
                            <Link to="/#search" className="hover:text-blue-400">Search</Link>
                            <Link to="/#result" className="hover:text-blue-400">Technologies</Link>
                            <Link to="/#report" className="hover:text-blue-400">Report</Link>
                        </>
                    ) : (
                        <>
                            <a href="#home" className="hover:text-blue-400">Home</a>
                            <a href="#about" className="hover:text-blue-400">About</a>
                            <a href="#search" className="hover:text-blue-400">Search</a>
                            <a href="#result" className="hover:text-blue-400">Technologies</a>
                            <a href="#report" className="hover:text-blue-400">Report</a>
                        </>
                    )}

                    <Link to="/history" className="hover:text-blue-400">
                        History
                    </Link>

                    <Link to="/admin-login" className="hover:text-blue-400">
                        Admin
                    </Link>

                </div>


                {/* Hamburger Button */}
                <button
                    className="nav:hidden text-white text-3xl"
                    onClick={toggleMenu}
                >
                    ☰
                </button>

            </div>


            {/* Mobile Menu */}
            {menuOpen && (

                <div className="nav:hidden bg-slate-900 border-t border-slate-700">

                    <div className="flex flex-col text-center text-lg text-gray-300 font-semibold py-4 space-y-4">

                        {isInnerPage ? (
                            <>
                                <Link to="/#home" onClick={toggleMenu}>Home</Link>
                                <Link to="/#about" onClick={toggleMenu}>About</Link>
                                <Link to="/#search" onClick={toggleMenu}>Search</Link>
                                <Link to="/#result" onClick={toggleMenu}>Technologies</Link>
                                <Link to="/#report" onClick={toggleMenu}>Report</Link>
                            </>
                        ) : (
                            <>
                                <a href="#home" onClick={toggleMenu}>Home</a>
                                <a href="#about" onClick={toggleMenu}>About</a>
                                <a href="#search" onClick={toggleMenu}>Search</a>
                                <a href="#result" onClick={toggleMenu}>Technologies</a>
                                <a href="#report" onClick={toggleMenu}>Report</a>
                            </>
                        )}

                        <Link to="/history" onClick={toggleMenu}>
                            History
                        </Link>

                        <Link to="/admin-login" onClick={toggleMenu}>
                            Admin
                        </Link>

                    </div>

                </div>

            )}

        </nav>
    );
}