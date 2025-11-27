'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { courtsApi, bookingsApi } from '@/lib/api';
import { CourtWithAvailability, TimeSlot, CreateBookingDto } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CourtsPage() {
    return (
        <ProtectedRoute>
            <CourtsContent />
        </ProtectedRoute>
    );
}

function CourtsContent() {
    const [courts, setCourts] = useState<CourtWithAvailability[]>([]);
    const [selectedCourt, setSelectedCourt] = useState<CourtWithAvailability | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadCourts();
    }, []);

    const loadCourts = async () => {
        try {
            const res = await courtsApi.getAllWithAvailability();
            setCourts(res.data);
            if (res.data.length > 0) {
                setSelectedCourt(res.data[0]);
            }
        } catch (error) {
            console.error('Failed to load courts:', error);
            setMessage({ type: 'error', text: 'Failed to load courts' });
        } finally {
            setLoading(false);
        }
    };

    const isSlotPast = (dateStr: string, timeStr: string) => {
        const now = new Date();
        const slotDate = new Date(dateStr);
        const [hours] = timeStr.split(':');
        slotDate.setHours(parseInt(hours), 0, 0, 0);

        // If date is today, check hour
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(dateStr);
        checkDate.setHours(0, 0, 0, 0);

        if (checkDate < today) return true;
        if (checkDate > today) return false;

        // Same day, check time
        return parseInt(hours) <= now.getHours();
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
        };
    };

    const handleBooking = async (slot: TimeSlot, dateStr: string) => {
        if (!selectedCourt) return;

        setBookingLoading(true);
        setMessage(null);

        try {
            // Create start time
            const startTime = new Date(dateStr);
            const [hours, minutes] = slot.startTime.split(':');
            startTime.setHours(parseInt(hours), parseInt(minutes || '0'), 0, 0);

            // Create end time (1 hour later)
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + 1);

            const bookingData: CreateBookingDto = {
                courtId: selectedCourt.id,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            };

            // 1. Initiate Booking
            const response = await bookingsApi.initiate(bookingData);
            const { booking, order } = response.data;

            // 2. Open Razorpay Checkout
            const options = {
                key: "rzp_test_Rko31c7YW2CGSK",
                amount: order.amount,
                currency: order.currency,
                name: "SmashClub",
                description: "Court Booking",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        await bookingsApi.verify({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature
                        });

                        setMessage({
                            type: 'success',
                            text: `Booking confirmed! Total: ₹${booking.totalPrice}`
                        });

                        // Refresh courts to update availability
                        await loadCourts();
                        setTimeout(() => router.push('/bookings'), 2000);
                    } catch (error) {
                        console.error('Verification failed:', error);
                        setMessage({
                            type: 'error',
                            text: 'Payment verification failed. Please contact support.'
                        });
                    }
                },
                prefill: {
                    name: "SmashClub User",
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#9333ea"
                },
                modal: {
                    ondismiss: function () {
                        setBookingLoading(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setMessage({
                    type: 'error',
                    text: response.error.description || 'Payment failed'
                });
                setBookingLoading(false);
            });
            rzp.open();

        } catch (error: any) {
            console.error('Booking error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to initiate booking. Slot may be already booked.',
            });
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-purple-300 font-medium">Loading courts...</p>
                </div>
            </div>
        );
    }

    // Generate operating hours (5 AM to 11 PM)
    const operatingHours = Array.from({ length: 19 }, (_, i) => i + 5);

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
                            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Browse Courts</h1>
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

                {/* Court Selection */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Select Court</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courts.map((court) => (
                            <button
                                key={court.id}
                                onClick={() => setSelectedCourt(court)}
                                className={`glass-effect rounded-xl p-4 text-left transition-all ${selectedCourt?.id === court.id
                                    ? 'border-2 border-purple-500 shadow-lg shadow-purple-500/20'
                                    : 'border border-white/10 hover:border-purple-500/50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-white">{court.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${court.type === 'SINGLE'
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {court.type}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-400">
                                    Base Rate: <span className="text-purple-400 font-semibold">₹{court.baseRate}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Weekly Availability Matrix */}
                {selectedCourt && (
                    <div className="glass-effect rounded-2xl p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-white">Availability Schedule</h2>
                                <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Live
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50"></div>
                                    <span className="text-gray-400">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></div>
                                    <span className="text-gray-400">Booked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-gray-800 border border-gray-700"></div>
                                    <span className="text-gray-400">Past/Unavailable</span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse min-w-[800px]">
                                <thead>
                                    <tr>
                                        <th className="p-4 text-left text-gray-400 font-medium border-b border-white/10 sticky left-0 bg-[#0f172a] z-10 w-24">
                                            Time
                                        </th>
                                        {[...selectedCourt.availability]
                                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                            .map((day, index) => {
                                                const { day: d, weekday } = formatDate(day.date);
                                                return (
                                                    <th key={index} className="p-4 text-center border-b border-white/10 min-w-[120px]">
                                                        <div className="text-purple-400 font-bold">{weekday}</div>
                                                        <div className="text-2xl text-white font-bold">{d}</div>
                                                    </th>
                                                );
                                            })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {operatingHours.map((hour) => {
                                        const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
                                        const displayTime = new Date(`2000-01-01T${timeLabel}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

                                        return (
                                            <tr key={hour} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-gray-400 font-medium sticky left-0 bg-[#0f172a] z-10 border-r border-white/10">
                                                    {displayTime}
                                                </td>
                                                {[...selectedCourt.availability]
                                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                                    .map((day, dayIndex) => {
                                                        const slot = day.slots.find(s => parseInt(s.hour) === hour);
                                                        const isPast = isSlotPast(day.date, timeLabel);
                                                        const isBooked = slot?.isBooked;
                                                        const isAvailable = slot && !isBooked && !isPast;

                                                        return (
                                                            <td key={dayIndex} className="p-2">
                                                                {slot ? (
                                                                    <button
                                                                        onClick={() => isAvailable && handleBooking(slot, day.date)}
                                                                        disabled={!isAvailable || bookingLoading}
                                                                        className={`w-full h-full min-h-[80px] rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${isAvailable
                                                                            ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 hover:scale-105 cursor-pointer'
                                                                            : isBooked
                                                                                ? 'bg-red-500/10 border border-red-500/30 text-red-400 cursor-not-allowed'
                                                                                : 'bg-gray-800/50 border border-gray-700 text-gray-500 cursor-not-allowed'
                                                                            }`}
                                                                    >
                                                                        <span className={`font-bold ${isAvailable ? 'text-green-400' : 'text-inherit'}`}>
                                                                            ₹{slot.price}
                                                                        </span>
                                                                        <span className="text-[10px] uppercase font-bold tracking-wider">
                                                                            {isBooked ? 'Booked' : isPast ? 'Closed' : 'Available'}
                                                                        </span>
                                                                    </button>
                                                                ) : (
                                                                    <div className="w-full h-full min-h-[80px] rounded-lg bg-gray-900/50 border border-white/5 flex items-center justify-center">
                                                                        <span className="text-gray-600">-</span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!selectedCourt && courts.length === 0 && (
                    <div className="glass-effect rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                        <svg className="w-20 h-20 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-xl font-semibold text-white mb-2">No Courts Available</h3>
                        <p className="text-gray-400">Please check back later</p>
                    </div>
                )}
            </main>
        </div>
    );
}
