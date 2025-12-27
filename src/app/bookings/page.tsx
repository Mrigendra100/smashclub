'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { bookingsApi } from '@/lib/api';
import { Booking } from '@/types';
import Link from 'next/link';

export default function BookingsPage() {
    return (
        <ProtectedRoute>
            <BookingsContent />
        </ProtectedRoute>
    );
}

function BookingsContent() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const res = await bookingsApi.getMy();
            setBookings(res.data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.startTime);
        const now = new Date();

        if (filter === 'upcoming') return bookingDate >= now;
        if (filter === 'past') return bookingDate < now;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-rich-white">
                <div className="min-h-screen flex items-center justify-center bg-rich-white">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-court-green border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-court-deep font-medium">Loading bookings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-rich-white pb-12">
            {/* Header */}
            <header className="glass-effect border-b border-slate-200 sticky top-0 z-40 bg-white/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <svg className="w-6 h-6 text-court-green group-hover:text-court-deep transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <img src="/logo.png" alt="SmashClub Logo" className="w-10 h-10 rounded-full object-cover border-2 border-court-green/50 bg-white" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-court-deep">My Bookings</h1>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {[
                        { key: 'all', label: 'All Bookings' },
                        { key: 'upcoming', label: 'Upcoming' },
                        { key: 'past', label: 'Past' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key as typeof filter)}
                            className={`px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ${filter === tab.key
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-white border border-slate-200 text-slate-500 hover:border-court-green/50 hover:text-court-deep hover:bg-slate-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                {filteredBookings.length > 0 ? (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-court-green/30 transition"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-slate-900">
                                                {booking.court?.name || 'Court'}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="space-y-1 text-slate-500 text-sm">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{new Date(booking.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>
                                                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {' - '}
                                                    {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {booking.durationHours && (
                                                        <span className="text-court-green ml-2">({booking.durationHours}h)</span>
                                                    )}
                                                </span>
                                            </div>
                                            {booking.court?.type && (
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    <span>Court Type: {booking.court.type}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        {booking.totalPrice && (
                                            <>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-court-deep">
                                                        ₹{booking.totalPrice}
                                                    </div>
                                                    <div className="text-xs text-slate-400">Total</div>
                                                </div>
                                                {booking.pricePerHour && (
                                                    <div className="text-xs text-slate-500">
                                                        ₹{booking.pricePerHour}/hour
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center text-center border border-slate-200">
                        <svg className="w-20 h-20 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Bookings Found</h3>
                        <p className="text-slate-400 mb-6">You haven't made any bookings yet</p>
                        <Link
                            href="/courts"
                            className="px-6 py-3 bg-court-green hover:bg-court-deep text-black font-semibold rounded-lg transition-all shadow-md"
                        >
                            Browse Courts
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
