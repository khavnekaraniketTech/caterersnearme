import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Utensils, BarChart3, ShieldCheck, Users, Settings, Layers } from "lucide-react";

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { name: 'Caterers Directory', icon: Utensils, to: "/" },
        { name: 'Vendor Analytics', icon: BarChart3, to: "/analytics" },
        { name: 'Premium Partners', icon: ShieldCheck, to: "/premium" },
        { name: 'User Management', icon: Users, to: "/users" },
        { name: 'System Settings', icon: Settings, to: "/settings" },
    ];

    return (
        <aside className="w-64 bg-kaiDark text-gray-400 fixed inset-y-0 left-0 z-40 hidden md:block border-r border-gray-800">
            {/* Brand Header Section */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-kaiDark">
                <div className="text-white text-lg font-bold tracking-wide flex items-center gap-3 select-none">
                    <Layers className="text-kaiPrimary w-6 h-6 animate-pulse" />
                    <span>
                        CATERERS <span className="font-light text-gray-500 text-sm ml-0.5"></span>
                    </span>
                </div>
            </div>

            {/* Navigation List Body */}
            <div className="py-6 px-4 overflow-y-auto h-[calc(100vh-4rem)]">
                <ul className="space-y-1.5">
                    {menuItems.map((item, idx) => {
                        const IconComponent = item.icon;
                        // Match active highlight status based on the current URL path
                        const isActive = location.pathname === item.to;

                        return (
                            <li key={idx}>
                                <Link
                                    to={item.to}
                                    className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left group cursor-pointer focus:outline-none ${isActive
                                            ? "bg-kaiPrimary text-white shadow-md shadow-kaiPrimary/20"
                                            : "hover:bg-white/5 hover:text-gray-200"
                                        }`}
                                >
                                    <IconComponent
                                        className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-gray-500 group-hover:text-kaiPrimary"
                                            }`}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}