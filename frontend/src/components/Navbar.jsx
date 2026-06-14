import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Bell, Mail, Clock, LogOut, User, Settings, Plus, Layers } from "lucide-react";

export default function Navbar({ setSearchQuery, onAddClick }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        //Clear token state auth memory profiles safely
        localStorage.clear();
        sessionStorage.clear();
        setShowUserMenu(false);
        navigate("/login");
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">

            {/* LEFT ACCENT: REAL-TIME SEARCH INTEGRATION FIELD */}
            <div className="w-5/12 md:w-1/2">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="text-gray-400 w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-kaiPrimary focus:bg-white transition-all shadow-inner"
                        placeholder="Search caterers by name or location..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* RIGHT ACCENT: INTERACTIVE CONTROLS HUD */}
            <div className="flex items-center space-x-2 md:space-x-4">
                {/* ACTION: CREATE VENDOR PROFILE OVERLAY TRIGGER */}
                <button
                    className="bg-kaiPrimary hover:bg-blue-600 text-white font-medium text-xs md:text-sm px-3 md:px-5 py-2 rounded-full shadow-md hover:shadow-lg flex items-center transition-all transform active:scale-95"
                    onClick={onAddClick}
                >
                    <Plus className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Add Vendor</span>
                </button>

                {/* HUD ICON: UTILITY INBOX LINK */}
                <button className="p-2 text-gray-400 hover:text-kaiPrimary rounded-lg hover:bg-gray-50 transition-colors relative hidden sm:block">
                    <Mail className="w-5 h-5" />
                </button>

                {/* HUD ICON: SYSTEM NOTIFICATIONS TRACKER */}
                <button className="p-2 text-gray-400 hover:text-kaiPrimary rounded-lg hover:bg-gray-50 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 bg-red-500 text-white font-bold rounded-full text-[9px] w-4 h-4 flex items-center justify-center">
                        4
                    </span>
                </button>

                {/* HUD ICON: SYSTEM ACTIVITY TRACKER */}
                <button className="p-2 text-gray-400 hover:text-kaiPrimary rounded-lg hover:bg-gray-50 transition-colors hidden sm:block">
                    <Clock className="w-5 h-5" />
                </button>

                {/* VISUAL SEPARATOR */}
                <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                {/* DROPDOWN USER PROFILE MODULE */}
                <div className="relative">
                    <button
                        className="flex items-center focus:outline-none rounded-full ring-2 ring-transparent hover:ring-kaiPrimary/30 transition-all p-0.5"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="profile icon"
                            className="rounded-full object-cover border border-kaiPrimary w-8 h-8"
                        />
                    </button>

                    {/* FLOATING USER MENU OVERLAY */}
                    {showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>

                            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate__animated animate__fadeIn animate__faster">
                                <div className="px-4 py-3 border-b border-gray-50 flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-kaiPrimary flex items-center justify-center font-bold text-white text-sm">
                                        AK
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 leading-tight">Aniket Khavnekar</h4>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">Platform Administrator</p>
                                    </div>
                                </div>

                                <div className="p-1">
                                    <button className="w-full flex items-center space-x-3 text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-kaiPrimary rounded-lg transition-colors">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span>My Profile</span>
                                    </button>

                                    <button className="w-full flex items-center space-x-3 text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-kaiPrimary rounded-lg transition-colors">
                                        <Settings className="w-4 h-4 text-gray-400" />
                                        <span>System Settings</span>
                                    </button>
                                </div>

                                <div className="border-t border-gray-50 my-1"></div>

                                <div className="p-1">
                                    <button
                                        className="w-full flex items-center space-x-3 text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout Workspace</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}