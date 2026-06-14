import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, IndianRupee, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function CatererCard({ caterer }) {
    // Highlights outstanding partners with a custom premium accent border
    const isElite = caterer.rating >= 4.7;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${isElite ? 'border-amber-200/70 hover:border-amber-400' : 'border-gray-100 hover:border-kaiPrimary/30'
                }`}
        >
            {/* ELITE BACKGROUND GLOW GRADIENT (Subtle UI touch) */}
            {isElite && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none rounded-bl-full" />
            )}

            <div>
                {/* CARD ROW 1: HEADER & RATING BADGE */}
                <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="text-base font-bold text-gray-900 tracking-tight line-clamp-1 group-hover:text-kaiPrimary transition-colors duration-200">
                        {caterer.name}
                    </h3>
                    <div className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-lg flex-shrink-0 shadow-sm border ${isElite ? 'bg-amber-50 border-amber-200/60' : 'bg-gray-50 border-gray-100'
                        }`}>
                        <Star className={`w-3.5 h-3.5 ${isElite ? 'text-amber-500 fill-amber-500' : 'text-gray-400 fill-gray-400'}`} />
                        <span className={`text-xs font-bold ${isElite ? 'text-amber-800' : 'text-gray-600'}`}>
                            {caterer.rating.toFixed(1)}
                        </span>
                    </div>
                </div>

                {/* CARD ROW 2: LOCATION INDICATOR */}
                <div className="flex items-center text-gray-400 text-xs mb-4 space-x-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-gray-300" />
                    <span className="text-gray-500">{caterer.location}</span>
                </div>

                {/* CARD ROW 3: CUISINES BADGE CONTAINER */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {caterer.cuisines.map((cuisine, idx) => (
                        <span
                            key={idx}
                            className="bg-slate-50 border border-slate-100/80 text-gray-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-md tracking-wide"
                        >
                            {cuisine}
                        </span>
                    ))}
                </div>
            </div>

            {/* CARD ROW 4: PLATFORM INTERACTION METRICS */}
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                <div className="flex items-center space-x-1 text-emerald-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Active Vendor</span>
                </div>

                <div className="flex items-center text-gray-900 tracking-tight">
                    <IndianRupee className="w-3.5 h-3.5 text-gray-800 stroke-[2.5]" />
                    <span className="text-base font-black ml-0.5">{caterer.pricePerPlate}</span>
                    <span className="text-[11px] text-gray-400 font-medium normal-case ml-0.5">/plate</span>
                </div>
            </div>

            {/* FLOATING ACTION INTERVIEW BONUS: Interactive corner button shown on hover */}
            <div className="absolute bottom-4 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden lg:block">
                <span className="text-[10px] text-kaiPrimary font-bold flex items-center gap-0.5 cursor-pointer pointer-events-auto">
                    View Menu <ArrowUpRight className="w-3 h-3" />
                </span>
            </div>
        </motion.div>
    );
}