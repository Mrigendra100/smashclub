'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { courtsApi, bookingsApi, passesApi, usersApi } from '@/lib/api';
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
    const [userRole, setUserRole] = useState<string | null>(null);

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

            // Try to fetch user role separately (non-blocking)
            try {
                const userRes = await usersApi.getMe();
                setUserRole(userRes.data.role);
            } catch (roleError: any) {
                console.warn('Could not fetch user role:', roleError);
                // Role will remain null, admin button won't show
            }
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
            <div className="min-h-screen flex items-center justify-center bg-rich-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-court-green border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-court-deep font-medium">Loading dashboard...</p>
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
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="SmashClub Logo" className="w-10 h-10 rounded-full object-cover border-2 border-court-green/50 bg-white" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-court-deep">SmashClub</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-slate-500 text-sm hidden sm:inline">{user?.email}</span>
                            {userRole === 'ADMIN' && (
                                <Link
                                    href="/admin"
                                    className="px-4 py-2 bg-court-green hover:bg-court-deep text-black font-semibold rounded-lg transition-all shadow-md text-sm"
                                >
                                    Admin
                                </Link>
                            )}
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm transition"
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
                    <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-2">
                        Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0]}!
                    </h2>
                    <p className="text-slate-500">Manage your bookings and explore available courts</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-slate-200 border-l-4 border-l-purple-500 shadow-sm">
                        <div className="text-purple-600 text-xs sm:text-sm font-semibold mb-1 truncate">Active Passes</div>
                        <div className="text-xl sm:text-3xl font-bold text-slate-800">{passes.length}</div>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-slate-200 border-l-4 border-l-blue-500 shadow-sm">
                        <div className="text-blue-600 text-xs sm:text-sm font-semibold mb-1 truncate">My Bookings</div>
                        <div className="text-xl sm:text-3xl font-bold text-slate-800">{bookings.length}</div>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-green-400 border-l-4 border-l-court-green shadow-sm">
                        <div className="text-court-deep text-xs sm:text-sm font-semibold mb-1 truncate">Total Courts</div>
                        <div className="text-xl sm:text-3xl font-bold text-slate-800">{courts.length}</div>
                    </div>
                </div>

                {/* Quick Actions */}
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 mb-8">
                    <Link
                        href="/courts"
                        className="w-[calc(50%-6px)] sm:w-auto bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:scale-[1.02] transition-transform cursor-pointer group shadow-sm hover:border-court-green/50"
                    >
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 text-court-green rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-sm sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2 group-hover:text-green-700">Browse Courts</h3>
                        <p className="text-slate-500 text-xs sm:text-sm">Explore and book available courts</p>
                    </Link>

                    <Link
                        href="/bookings"
                        className="w-[calc(50%-6px)] sm:w-auto bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:scale-[1.02] transition-transform cursor-pointer group shadow-sm hover:border-blue-400/50"
                    >
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-sm sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2 group-hover:text-blue-700">My Bookings</h3>
                        <p className="text-slate-500 text-xs sm:text-sm">View and manage your bookings</p>
                    </Link>

                    <Link
                        href="/passes"
                        className="w-[calc(50%-6px)] sm:w-auto bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:scale-[1.02] transition-transform cursor-pointer group shadow-sm hover:border-purple-400/50"
                    >
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-50 text-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <h3 className="text-sm sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2 group-hover:text-purple-700">My Passes</h3>
                        <p className="text-slate-500 text-xs sm:text-sm">Manage your membership passes</p>
                    </Link>
                </div>

                {/* Recent Bookings */}
                {bookings.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Recent Bookings</h3>
                        <div className="space-y-3">
                            {bookings.slice(0, 3).map((booking) => (
                                <div
                                    key={booking.id}
                                    className="bg-slate-50 rounded-lg p-4 border border-slate-100 hover:border-court-green/30 transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-slate-900">{booking.court?.name || 'Court'}</div>
                                            <div className="text-sm text-slate-500">
                                                {new Date(booking.startTime).toLocaleDateString()} •{' '}
                                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                                                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
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
