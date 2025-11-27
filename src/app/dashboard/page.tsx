'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { courtsApi, bookingsApi, passesApi } from '@/lib/api';
import { CourtWithAvailability, Booking, Pass } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [courts, setCourts] = useState<CourtWithAvailability[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [passes, setPasses] = useState<Pass[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load courts first (public endpoint, doesn't require auth)
            const courtsRes = await courtsApi.getAllWithAvailability();
            setCourts(courtsRes.data);

            // Load user-specific data (requires auth)
            const [bookingsRes, passesRes] = await Promise.all([
                bookingsApi.getMy(),
                passesApi.getMy(),
            ]);
            setBookings(bookingsRes.data);
            setPasses(passesRes.data);
        } catch (error: any) {
            console.error('Failed to load data:', error);
            // If it's an auth error, might need to re-login
            if (error.response?.status === 401) {
                console.error('Authentication failed. Please log in again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-purple-300 font-medium">Loading dashboard...</p>
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
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="SmashClub Logo" className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50 bg-white" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">SmashClub</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300 text-sm hidden sm:inline">{user?.email}</span>
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm transition"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        Welcome back! 👋
                    </h2>
                    <p className="text-gray-400">Manage your bookings and explore available courts</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="glass-effect rounded-2xl p-6 border-l-4 border-purple-500">
                        <div className="text-purple-400 text-sm font-semibold mb-1">Active Passes</div>
                        <div className="text-3xl font-bold text-white">{passes.length}</div>
                    </div>
                    <div className="glass-effect rounded-2xl p-6 border-l-4 border-blue-500">
                        <div className="text-blue-400 text-sm font-semibold mb-1">My Bookings</div>
                        <div className="text-3xl font-bold text-white">{bookings.length}</div>
                    </div>
                    <div className="glass-effect rounded-2xl p-6 border-l-4 border-green-500">
                        <div className="text-green-400 text-sm font-semibold mb-1">Available Courts</div>
                        <div className="text-3xl font-bold text-white">{courts.length}</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Link
                        href="/courts"
                        className="glass-effect rounded-2xl p-6 hover:scale-[1.02] transition-transform cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Browse Courts</h3>
                        <p className="text-gray-400 text-sm">Explore and book available courts</p>
                    </Link>

                    <Link
                        href="/bookings"
                        className="glass-effect rounded-2xl p-6 hover:scale-[1.02] transition-transform cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">My Bookings</h3>
                        <p className="text-gray-400 text-sm">View and manage your bookings</p>
                    </Link>

                    <Link
                        href="/passes"
                        className="glass-effect rounded-2xl p-6 hover:scale-[1.02] transition-transform cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">My Passes</h3>
                        <p className="text-gray-400 text-sm">Manage your membership passes</p>
                    </Link>
                </div>

                {/* Recent Bookings */}
                {bookings.length > 0 && (
                    <div className="glass-effect rounded-2xl p-6 mb-8">
                        <h3 className="text-2xl font-bold text-white mb-4">Recent Bookings</h3>
                        <div className="space-y-3">
                            {bookings.slice(0, 3).map((booking) => (
                                <div
                                    key={booking.id}
                                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-white">{booking.court?.name || 'Court'}</div>
                                            <div className="text-sm text-gray-400">
                                                {new Date(booking.startTime).toLocaleDateString()} •{' '}
                                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                                                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                                            booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
