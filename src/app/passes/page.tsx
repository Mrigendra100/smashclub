'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { passesApi } from '@/lib/api';
import { Pass, PurchasePassDto } from '@/types';
import Link from 'next/link';

export default function PassesPage() {
    return (
        <ProtectedRoute>
            <PassesContent />
        </ProtectedRoute>
    );
}

function PassesContent() {
    const [passes, setPasses] = useState<Pass[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadPasses();
    }, []);

    const loadPasses = async () => {
        try {
            const res = await passesApi.getMy();
            setPasses(res.data);
        } catch (error) {
            console.error('Failed to load passes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (type: 'MONTHLY' | 'YEARLY') => {
        setPurchaseLoading(true);
        setMessage(null);

        try {
            const purchaseData: PurchasePassDto = { type };
            await passesApi.purchase(purchaseData);
            setMessage({ type: 'success', text: `${type} pass purchased successfully!` });
            await loadPasses();
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to purchase pass',
            });
        } finally {
            setPurchaseLoading(false);
        }
    };

    const getDaysRemaining = (validUntil: string) => {
        const now = new Date();
        const expiryDate = new Date(validUntil);
        const diffTime = expiryDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-purple-300 font-medium">Loading passes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            {/* Header */}
            <header className="glass-effect border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <svg className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <img src="/logo.png" alt="SmashClub Logo" className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/50 bg-white" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">My Passes</h1>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                        : 'bg-red-500/10 border border-red-500/50 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Active Passes */}
                {passes.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Active Passes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {passes.map((pass) => {
                                const daysRemaining = getDaysRemaining(pass.validUntil);
                                const isExpiringSoon = daysRemaining <= 7;

                                return (
                                    <div
                                        key={pass.id}
                                        className="glass-effect rounded-2xl p-6 border border-white/10 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>

                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${pass.type === 'MONTHLY'
                                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                                    }`}>
                                                    {pass.type} PASS
                                                </span>
                                                {pass.isActive && (
                                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                                                        ACTIVE
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-3 text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-sm">
                                                        Valid Until: {new Date(pass.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </span>
                                                </div>

                                                <div className={`flex items-center gap-2 ${isExpiringSoon ? 'text-yellow-400' : ''}`}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-sm font-semibold">
                                                        {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
                                                    </span>
                                                </div>

                                                {pass.remainingCredits !== null && (
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                                        </svg>
                                                        <span className="text-sm">Credits: {pass.remainingCredits}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Purchase New Pass */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Purchase New Pass</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Monthly Pass */}
                        <div className="glass-effect rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

                            <div className="relative">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">Monthly Pass</h3>
                                    <p className="text-gray-400 text-sm">Perfect for regular players</p>
                                </div>

                                <div className="mb-6">
                                    <div className="text-5xl font-bold text-gradient mb-2">₹999</div>
                                    <p className="text-gray-500 text-sm">Valid for 30 days</p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm">Unlimited court bookings</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm">Priority booking access</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm">Flexible cancellation</span>
                                    </li>
                                </ul>

                                <button
                                    onClick={() => handlePurchase('MONTHLY')}
                                    disabled={purchaseLoading}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50"
                                >
                                    Purchase Monthly
                                </button>
                            </div>
                        </div>

                        {/* Yearly Pass */}
                        <div className="glass-effect rounded-2xl p-8 border-2 border-blue-500/50 hover:border-blue-500 transition relative overflow-hidden group">
                            <div className="absolute -top-4 right-4 px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full transform rotate-12">
                                BEST VALUE
                            </div>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

                            <div className="relative">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">Yearly Pass</h3>
                                    <p className="text-gray-400 text-sm">Save 40% with annual membership</p>
                                </div>

                                <div className="mb-6">
                                    <div className="text-5xl font-bold text-gradient mb-2">₹5,999</div>
                                    <p className="text-gray-500 text-sm">Valid for 365 days</p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm">Everything in Monthly</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm">Guest pass privileges</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm">Premium equipment access</span>
                                    </li>
                                </ul>

                                <button
                                    onClick={() => handlePurchase('YEARLY')}
                                    disabled={purchaseLoading}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/50"
                                >
                                    Purchase Yearly
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
