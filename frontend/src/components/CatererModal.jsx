import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Utensils, MapPin, IndianRupee, Star, AlertCircle } from 'lucide-react';

export default function CatererModal({ isOpen, onClose, onSubmitSuccess }) {
    const [formError, setFormError] = useState('');
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        pricePerPlate: '',
        cuisines: '',
        rating: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Frontend Validations
        if (!formData.name.trim()) return setFormError("Caterer brand name field cannot be blank.");
        if (!formData.location.trim()) return setFormError("Primary operation location cannot be blank.");
        if (!formData.pricePerPlate || Number(formData.pricePerPlate) <= 0) return setFormError("Price per plate must be a positive number.");
        if (!formData.cuisines.trim()) return setFormError("Please enter at least one cuisine specialty.");
        if (!formData.rating || Number(formData.rating) < 0 || Number(formData.rating) > 5) return setFormError("Rating must be a value between 0.0 and 5.0.");

        try {
            setFormSubmitting(true);

            const cleanPayload = {
                name: formData.name.trim(),
                location: formData.location.trim(),
                pricePerPlate: Number(formData.pricePerPlate),
                cuisines: formData.cuisines.split(',').map(tag => tag.trim()).filter(tag => tag !== ""),
                rating: Number(formData.rating)
            };

            // Call the success handler passed down from the parent page component
            await onSubmitSuccess(cleanPayload);

            // Reset form fields on success
            setFormData({ name: '', location: '', pricePerPlate: '', cuisines: '', rating: '' });
            onClose();
        } catch (err) {
            setFormError(err.response?.data?.error || "Transaction Execution Interrupted: Backend validation failure.");
        } finally {
            setFormSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Modal Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !formSubmitting && onClose()}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Content Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden z-10 relative flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center space-x-2.5 text-kaiPrimary">
                                <Plus className="w-5 h-5 stroke-[2.5]" />
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Register New Vendor</h3>
                            </div>
                            <button
                                disabled={formSubmitting}
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none disabled:opacity-40"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{formError}</span>
                                </div>
                            )}

                            {/* Input: Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                                    <Utensils className="w-3 h-3 text-gray-400" /> Caterer Brand Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Gourmet Kitchens Ltd."
                                    className="w-full bg-slate-50/70 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-kaiPrimary focus:bg-white border-b-2 transition-all"
                                />
                            </div>

                            {/* Input: Location */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-gray-400" /> Geographic Region Hub
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Mumbai"
                                    className="w-full bg-slate-50/70 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-kaiPrimary focus:bg-white border-b-2 transition-all"
                                />
                            </div>

                            {/* Inputs: Pricing & Rating */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                                        <IndianRupee className="w-3 h-3 text-gray-400" /> Price / Plate
                                    </label>
                                    <input
                                        type="number"
                                        name="pricePerPlate"
                                        required
                                        min="1"
                                        value={formData.pricePerPlate}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 450"
                                        className="w-full bg-slate-50/70 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-kaiPrimary focus:bg-white border-b-2 transition-all"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                                        <Star className="w-3 h-3 text-gray-400" /> Quality Rating Score
                                    </label>
                                    <input
                                        type="number"
                                        name="rating"
                                        required
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        placeholder="0.0 - 5.0"
                                        className="w-full bg-slate-50/70 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-kaiPrimary focus:bg-white border-b-2 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Input: Cuisines */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                                    Cuisine Badges Specialties <span className="text-slate-400 normal-case font-medium">(Separated via commas)</span>
                                </label>
                                <input
                                    type="text"
                                    name="cuisines"
                                    required
                                    value={formData.cuisines}
                                    onChange={handleInputChange}
                                    placeholder="e.g., North Indian, Italian, Continental"
                                    className="w-full bg-slate-50/70 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-kaiPrimary focus:bg-white border-b-2 transition-all"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="border-t border-gray-100 pt-5 flex items-center justify-end space-x-3 mt-2">
                                <button
                                    type="button"
                                    disabled={formSubmitting}
                                    onClick={onClose}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors focus:outline-none disabled:opacity-40"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formSubmitting}
                                    className="px-5 py-2 bg-kaiPrimary hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors focus:outline-none flex items-center justify-center disabled:opacity-50 min-w-[110px]"
                                >
                                    {formSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                    ) : (
                                        "Save Vendor"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}