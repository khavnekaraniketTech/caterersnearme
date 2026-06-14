import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, AlertCircle, ChefHat, Store, Wallet, Star } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import CatererCard from '../components/CatererCards';
import CatererModal from '../components/CatererModal'; 

// Dynamic router mapping for local dev versus live Vercel deployments
const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000/api/caterers" 
  : "/api/caterers";

export default function CaterersPage({ view }) {
    const [caterers, setCaterers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState(1200);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const streamCaterers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_URL);
                setCaterers(response.data);
            } catch (err) {
                setError("API Connection Error: Could not connect to data sync service.");
            } finally {
                setLoading(false);
            }
        };
        streamCaterers();
    }, []);

    const filteredCaterers = caterers.filter(caterer => {
        const matchesSearch =
            caterer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            caterer.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = caterer.pricePerPlate <= maxPrice;

        if (view === "premium") {
            return matchesSearch && matchesPrice && caterer.rating >= 4.7;
        }
        return matchesSearch && matchesPrice;
    });

    const totalVendors = filteredCaterers.length;
    const avgPrice = totalVendors > 0
        ? Math.round(filteredCaterers.reduce((acc, curr) => acc + curr.pricePerPlate, 0) / totalVendors)
        : 0;
    const eliteVendors = filteredCaterers.filter(c => c.rating >= 4.7).length;

    const handleAddVendorSubmit = async (payloadData) => {
        const response = await axios.post(API_URL, payloadData);
        setCaterers(prev => [response.data, ...prev]);
    };

    const viewTitles = {
        directory: "Caterers Management HUD",
        analytics: "Vendor Performance Analytics Dashboard",
        premium: "Premium Catering Network (Top Rated 4.7+)",
        users: "User Access Control",
        settings: "System Configuration Management"
    };

    return (
        <div className="flex min-h-screen bg-kaiBg text-slate-600 antialiased font-sans">
            <Sidebar />

            <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
                <Navbar setSearchQuery={setSearchQuery} onAddClick={() => setIsModalOpen(true)} />

                <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl mb-1">
                                {viewTitles[view] || "Caterers Management HUD"}
                            </h1>
                            <p className="text-xs font-medium text-slate-400">
                                Monitor and organize culinary distribution assets matching live query metrics.
                            </p>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-kaiBorder shadow-kai flex items-center space-x-3.5 min-w-[290px]">
                            <div className="p-2 bg-slate-50 border border-kaiBorder rounded-xl text-slate-400 flex-shrink-0">
                                <SlidersHorizontal className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-[10px] font-extrabold text-slate-500 uppercase tracking-wide mb-1">
                                    <span>Max Budget Filter</span>
                                    <span className="text-kaiPrimary">₹{maxPrice}</span>
                                </div>
                                <input
                                    type="range"
                                    min="300"
                                    max="1200"
                                    step="50"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-kaiPrimary focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center space-x-3 shadow-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs font-bold">{error}</span>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                            <div className="bg-white p-4 rounded-2xl border border-kaiBorder shadow-kai flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-kaiPrimary flex items-center justify-center flex-shrink-0 border border-blue-100">
                                    <Store className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Active Partners</span>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">{totalVendors}</h3>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-kaiBorder shadow-kai flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-kaiSuccess flex items-center justify-center flex-shrink-0 border border-emerald-100">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Avg Budget Scale</span>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">₹{avgPrice}</h3>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-kaiBorder shadow-kai flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-kaiWarning flex items-center justify-center flex-shrink-0 border border-amber-100">
                                    <Star className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Top Tier (4.7+)</span>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">{eliteVendors}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-36 space-y-3">
                            <div className="animate-spin inline-block w-6 h-6 border-[2.5px] border-kaiPrimary border-t-transparent rounded-full"></div>
                            <span className="text-xs font-bold text-slate-400 tracking-wider">Streaming configuration values...</span>
                        </div>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredCaterers.map(caterer => (
                                    <CatererCard key={caterer.id} caterer={caterer} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {!loading && filteredCaterers.length === 0 && !error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-white border border-kaiBorder rounded-2xl p-8 max-w-sm mx-auto shadow-kai"
                        >
                            <ChefHat className="w-10 h-10 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
                            <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">No matching results</h5>
                            <p className="text-[11px] text-slate-400 mt-1 max-w-[220px] mx-auto leading-relaxed">
                                Try adjustment filters, budget parameters, or modifying input keywords.
                            </p>
                        </motion.div>
                    )}
                </main>
            </div>
            <CatererModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmitSuccess={handleAddVendorSubmit}
            />
        </div>
    );
}