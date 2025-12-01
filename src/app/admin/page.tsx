'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi, AdminStats, AdminBooking, BulkBookingInput } from '@/lib/api/admin';
import Link from 'next/link';

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [todayBookings, setTodayBookings] = useState<AdminBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showSingleModal, setShowSingleModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showTodayBookings, setShowTodayBookings] = useState(false);

    // Pre-filled with default values
    const [singleFormData, setSingleFormData] = useState({
        userId: '17a7f725-3b30-43e1-b151-a52e95e30bbe',
        courtId: '00000000-0000-0000-0000-000000000001',
        startTime: '',
        endTime: '',
    });

    const [bulkFormData, setBulkFormData] = useState<BulkBookingInput>({
        userId: '17a7f725-3b30-43e1-b151-a52e95e30bbe',
        courtId: '00000000-0000-0000-0000-000000000001',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        daysOfWeek: [],
    });

    const [bulkResult, setBulkResult] = useState<any>(null);
    const [singleLoading, setSingleLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [page]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsRes, bookingsRes, todayRes] = await Promise.all([
                adminApi.getStats(),
                adminApi.getAllBookings(page, 10),
                adminApi.getTodayBookings(),
            ]);

            setStats(statsRes.data);
            setBookings(bookingsRes.data.data);
            setTotalPages(bookingsRes.data.meta.totalPages);
            setTodayBookings(todayRes.data);
        } catch (error) {
            console.error('Failed to load admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSingleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSingleLoading(true);
            await adminApi.createManualBooking(singleFormData);
            alert('✅ Booking created successfully!');
            setShowSingleModal(false);
            setSingleFormData({
                userId: '17a7f725-3b30-43e1-b151-a52e95e30bbe',
                courtId: '00000000-0000-0000-0000-000000000001',
                startTime: '',
                endTime: ''
            });
            loadData();
        } catch (error: any) {
            console.error('Manual booking failed:', error);
            alert(`❌ Booking failed: ${error.response?.data?.message || 'Unknown error'}`);
        } finally {
            setSingleLoading(false);
        }
    };

    const handleBulkBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await adminApi.createBulkBooking(bulkFormData);
            setBulkResult(result.data);
            loadData();
        } catch (error) {
            console.error('Bulk booking failed:', error);
            alert('Bulk booking failed. Please try again.');
        }
    };

    const toggleDay = (day: number) => {
        setBulkFormData(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek?.includes(day)
                ? prev.daysOfWeek.filter(d => d !== day)
                : [...(prev.daysOfWeek || []), day]
        }));
    };

    if (loading && !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-purple-300 font-medium">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            <header className="glass-effect border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="SmashClub Logo" className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50 bg-white" />
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gradient">Admin Dashboard</h1>
                                <p className="text-xs text-gray-400">SmashClub Management</p>
                            </div>
                        </div>
                        <Link href="/dashboard" className="px-3 py-2 sm:px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm transition">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-purple-500">
                        <div className="text-purple-400 text-xs sm:text-sm font-semibold mb-1">Total Revenue</div>
                        <div className="text-xl sm:text-3xl font-bold text-white">₹{stats?.totalRevenue.toLocaleString() || 0}</div>
                    </div>
                    <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-green-500">
                        <div className="text-green-400 text-xs sm:text-sm font-semibold mb-1">Today&apos;s Revenue</div>
                        <div className="text-xl sm:text-3xl font-bold text-white">₹{stats?.revenueToday.toLocaleString() || 0}</div>
                    </div>
                    <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-blue-500">
                        <div className="text-blue-400 text-xs sm:text-sm font-semibold mb-1">Total Bookings</div>
                        <div className="text-xl sm:text-3xl font-bold text-white">{stats?.totalBookings || 0}</div>
                    </div>
                    <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-cyan-500">
                        <div className="text-cyan-400 text-xs sm:text-sm font-semibold mb-1">Bookings Today</div>
                        <div className="text-xl sm:text-3xl font-bold text-white">{stats?.bookingsToday || 0}</div>
                    </div>
                </div>

                <div className="mb-6">
                    <button onClick={() => setShowTodayBookings(!showTodayBookings)} className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 rounded-lg text-cyan-400 font-semibold transition-all flex items-center gap-2">
                        <span>{showTodayBookings ? '📅 Showing Today\'s Bookings' : '📅 View Today\'s Bookings'}</span>
                        <span className="bg-cyan-500/30 px-2 py-0.5 rounded-full text-xs">{todayBookings.length}</span>
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{showTodayBookings ? 'Today\'s Bookings' : 'All Bookings'}</h2>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={() => setShowSingleModal(true)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg active:scale-95 text-sm">
                            + Single Booking
                        </button>
                        <button onClick={() => setShowBulkModal(true)} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg active:scale-95 text-sm">
                            📅 Bulk Booking
                        </button>
                    </div>
                </div>

                <div className="glass-effect rounded-2xl overflow-hidden">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-white/10">
                                    <th className="p-4 text-gray-400 font-semibold">User</th>
                                    <th className="p-4 text-gray-400 font-semibold">Court</th>
                                    <th className="p-4 text-gray-400 font-semibold">Time</th>
                                    <th className="p-4 text-gray-400 font-semibold">Amount</th>
                                    <th className="p-4 text-gray-400 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(showTodayBookings ? todayBookings : bookings).map((booking) => (
                                    <tr key={booking.id} className="border-b border-white/10 hover:bg-white/5 transition">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{booking.user.name}</div>
                                            <div className="text-sm text-gray-400">{booking.user.email}</div>
                                        </td>
                                        <td className="p-4 text-white">{booking.court.name}</td>
                                        <td className="p-4">
                                            <div className="text-white">{new Date(booking.startTime).toLocaleDateString()}</div>
                                            <div className="text-sm text-gray-400">
                                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="p-4 text-white font-semibold">₹{booking.totalPrice}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                                                    booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:hidden divide-y divide-white/10">
                        {(showTodayBookings ? todayBookings : bookings).map((booking) => (
                            <div key={booking.id} className="p-4 hover:bg-white/5 transition">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="font-semibold text-white">{booking.user.name}</div>
                                        <div className="text-sm text-gray-400">{booking.user.email}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                                            booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <div className="text-gray-400">Court</div>
                                        <div className="text-white font-medium">{booking.court.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">Amount</div>
                                        <div className="text-white font-bold">₹{booking.totalPrice}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-gray-400">Time</div>
                                        <div className="text-white">
                                            {new Date(booking.startTime).toLocaleDateString()} • {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 p-4 flex items-center justify-between">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-lg text-gray-300 text-sm transition">
                            Previous
                        </button>
                        <span className="text-gray-300 text-sm">Page {page} of {totalPages}</span>
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-lg text-gray-300 text-sm transition">
                            Next
                        </button>
                    </div>
                </div>
            </main>

            {/* Single Booking Modal */}
            {showSingleModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="glass-effect rounded-2xl p-6 max-w-md w-full border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">Manual Single Booking</h3>
                        <form onSubmit={handleSingleBooking} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-2">User ID</label>
                                <input type="text" required value={singleFormData.userId} onChange={(e) => setSingleFormData({ ...singleFormData, userId: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" placeholder="user-uuid" />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-2">Court ID</label>
                                <input type="text" required value={singleFormData.courtId} onChange={(e) => setSingleFormData({ ...singleFormData, courtId: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" placeholder="court-uuid" />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-2">Start Time (ISO 8601)</label>
                                <input type="datetime-local" required value={singleFormData.startTime} onChange={(e) => setSingleFormData({ ...singleFormData, startTime: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-2">End Time (ISO 8601)</label>
                                <input type="datetime-local" required value={singleFormData.endTime} onChange={(e) => setSingleFormData({ ...singleFormData, endTime: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={singleLoading} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all shadow-lg">
                                    {singleLoading ? 'Creating...' : 'Create Booking'}
                                </button>
                                <button type="button" onClick={() => setShowSingleModal(false)} className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Booking Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="glass-effect rounded-2xl p-6 max-w-2xl w-full border border-white/10 my-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Bulk Booking (Coaching Batches)</h3>
                        {bulkResult ? (
                            <div>
                                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                                    <p className="text-green-400 font-semibold">✅ Success: {bulkResult.successCount} bookings created</p>
                                    {bulkResult.failureCount > 0 && <p className="text-yellow-400">⚠️ Failed: {bulkResult.failureCount} bookings</p>}
                                </div>
                                {bulkResult.errors?.length > 0 && (
                                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg max-h-40 overflow-y-auto">
                                        <p className="text-red-400 font-semibold mb-2">Errors:</p>
                                        {bulkResult.errors.map((err: any, i: number) => (
                                            <p key={i} className="text-sm text-red-300">{err.date}: {err.error}</p>
                                        ))}
                                    </div>
                                )}
                                <button onClick={() => { setShowBulkModal(false); setBulkResult(null); }} className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition">
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleBulkBooking} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">User ID</label>
                                        <input type="text" required value={bulkFormData.userId} onChange={(e) => setBulkFormData({ ...bulkFormData, userId: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" placeholder="user-uuid" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">Court ID</label>
                                        <input type="text" required value={bulkFormData.courtId} onChange={(e) => setBulkFormData({ ...bulkFormData, courtId: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" placeholder="court-uuid" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">Start Date</label>
                                        <input type="date" required value={bulkFormData.startDate} onChange={(e) => setBulkFormData({ ...bulkFormData, startDate: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">End Date</label>
                                        <input type="date" required value={bulkFormData.endDate} onChange={(e) => setBulkFormData({ ...bulkFormData, endDate: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">Start Time</label>
                                        <input type="time" required value={bulkFormData.startTime} onChange={(e) => setBulkFormData({ ...bulkFormData, startTime: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-semibold mb-2">End Time</label>
                                        <input type="time" required value={bulkFormData.endTime} onChange={(e) => setBulkFormData({ ...bulkFormData, endTime: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-semibold mb-2">Days of Week (Optional)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {[{ val: 1, name: 'Mon' }, { val: 2, name: 'Tue' }, { val: 3, name: 'Wed' }, { val: 4, name: 'Thu' }, { val: 5, name: 'Fri' }, { val: 6, name: 'Sat' }, { val: 0, name: 'Sun' }].map(day => (
                                            <button key={day.val} type="button" onClick={() => toggleDay(day.val)} className={`px-4 py-2 rounded-lg font-semibold transition ${bulkFormData.daysOfWeek?.includes(day.val) ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                                                {day.name}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Leave empty to book all days in range</p>
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg">
                                        Create Bulk Bookings
                                    </button>
                                    <button type="button" onClick={() => setShowBulkModal(false)} className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
