'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { courtsApi, bookingsApi } from '@/lib/api';
import { CourtWithAvailability, TimeSlot, CreateBookingDto } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function CourtsPage() {
    return (
        <ProtectedRoute>
            <CourtsContent />
        </ProtectedRoute>
    );
}

interface SelectedSlot {
    courtId: string;
    courtName: string;
    date: string;
    slot: TimeSlot;
    price: number;
}

function CourtsContent() {
    const { user } = useAuth();
    const [courts, setCourts] = useState<CourtWithAvailability[]>([]);
    const [selectedCourt, setSelectedCourt] = useState<CourtWithAvailability | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
    const [showCartDrawer, setShowCartDrawer] = useState(false);
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

    const handleSlotSelect = (slot: TimeSlot, dateStr: string) => {
        if (!selectedCourt) return;

        const slotKey = `${selectedCourt.id}-${dateStr}-${slot.startTime}`;
        const existingIndex = selectedSlots.findIndex(
            s => `${s.courtId}-${s.date}-${s.slot.startTime}` === slotKey
        );

        if (existingIndex >= 0) {
            setSelectedSlots(prev => prev.filter((_, i) => i !== existingIndex));
        } else {
            const newSlot: SelectedSlot = {
                courtId: selectedCourt.id,
                courtName: selectedCourt.name,
                date: dateStr,
                slot,
                price: slot.price
            };
            setSelectedSlots(prev => [...prev, newSlot]);
        }
    };

    const isSlotSelected = (slot: TimeSlot, dateStr: string): boolean => {
        if (!selectedCourt) return false;
        const slotKey = `${selectedCourt.id}-${dateStr}-${slot.startTime}`;
        return selectedSlots.some(
            s => `${s.courtId}-${s.date}-${s.slot.startTime}` === slotKey
        );
    };

    const removeSlot = (index: number) => {
        setSelectedSlots(prev => prev.filter((_, i) => i !== index));
    };

    const getTotalPrice = () => {
        return selectedSlots.reduce((sum, slot) => sum + slot.price, 0);
    };

    const handleBulkCheckout = async () => {
        if (selectedSlots.length === 0) return;

        setBookingLoading(true);
        setMessage(null);

        try {
            // Prepare booking data
            const bookingsData = selectedSlots.map(s => {
                const startTime = new Date(s.date);
                const [hours, minutes] = s.slot.startTime.split(':');
                startTime.setHours(parseInt(hours), parseInt(minutes || '0'), 0, 0);

                const endTime = new Date(startTime);
                endTime.setHours(endTime.getHours() + 1);

                return {
                    courtId: s.courtId,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                };
            });

            console.log('Sending Bulk Booking Payload:', bookingsData);

            // 1. Initiate Bulk Booking
            const response = await bookingsApi.bulkInitiate(bookingsData);
            console.log('Bulk Booking Response:', response.data);
            const { order } = response.data;

            // 2. Open Razorpay Checkout
            const options = {
                key: "rzp_live_RmMxLfNxbcvnFx",
                amount: order.amount,
                currency: order.currency,
                name: "SmashClub",
                description: `Bulk Booking (${selectedSlots.length} slots)`,
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
                            text: `Bulk booking confirmed! Total: ₹${order.amount / 100}`
                        });

                        setSelectedSlots([]); // Clear cart
                        setShowCartDrawer(false);

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
                    name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
                    email: user?.email || '',
                    contact: user?.user_metadata?.phone || ''
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
            console.error('Bulk booking error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to initiate bulk booking.',
            });
            setBookingLoading(false);
        }
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
                key: "rzp_live_RmMxLfNxbcvnFx",
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
                    name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
                    email: user?.email || '',
                    contact: user?.user_metadata?.phone || ''
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
                                    ? 'border-2 border-green-500 shadow-lg shadow-green-500/80'
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
                                                        const slot = day.slots.find(s => s.hour === hour);
                                                        const isPast = isSlotPast(day.date, timeLabel);
                                                        const isBooked = slot?.isBooked;
                                                        const isAvailable = slot && !isBooked && !isPast;

                                                        return (
                                                            <td key={dayIndex} className="p-2">
                                                                {slot ? (
                                                                    <button
                                                                        onClick={() => isAvailable && handleSlotSelect(slot, day.date)}
                                                                        disabled={!isAvailable}
                                                                        className={`relative w-full h-full min-h-[80px] rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${isSlotSelected(slot, day.date)
                                                                            ? 'bg-green-600/30 border-2 border-green-500 shadow-lg shadow-green-500/20 scale-105'
                                                                            : isAvailable
                                                                                ? 'bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 hover:scale-105 cursor-pointer'
                                                                                : isBooked
                                                                                    ? 'bg-red-500/10 border border-red-500/30 text-red-400 cursor-not-allowed'
                                                                                    : 'bg-gray-800/50 border border-gray-700 text-gray-500 cursor-not-allowed'
                                                                            }`}
                                                                    >
                                                                        {isSlotSelected(slot, day.date) && (
                                                                            <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                        <span className={`font-bold ${isSlotSelected(slot, day.date) ? 'text-green-300' : isAvailable ? 'text-cyan-400' : 'text-inherit'}`}>
                                                                            ₹{slot.price}
                                                                        </span>
                                                                        <span className="text-[10px] uppercase font-bold tracking-wider">
                                                                            {isSlotSelected(slot, day.date) ? 'Selected' : isBooked ? 'Booked' : isPast ? 'Closed' : 'Tap to Select'}
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

                {/* Bottom Cart - Fixed */}
                {selectedSlots.length > 0 && (
                    <div className="fixed bottom-0 bg-white left-0 right-0 z-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                            <div className="glass-effect rounded-2xl border-2 border-green-500 shadow-2xl shadow-green-500/20">
                                <button onClick={() => setShowCartDrawer(!showCartDrawer)} className="w-full p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {selectedSlots.length}
                                        </div>
                                        <div className="text-left flex">
                                            <div className="text-white font-semibold">
                                                {selectedSlots.length} Slot{selectedSlots.length > 1 ? 's' : ''} Selected
                                            </div>
                                            <div className="text-green-400 text-sm font-bold">
                                                Total: ₹{getTotalPrice()}
                                            </div>
                                        </div>
                                    </div>
                                    <svg className={`w-5 h-5 text-green-500 transition-transform ${showCartDrawer ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </button>

                                {/* Cart Drawer Content */}
                                {showCartDrawer && (
                                    <div className="border-t border-white/10 p-4 max-h-[60vh] overflow-y-auto">
                                        <div className="space-y-2 mb-4">
                                            {selectedSlots.map((selectedSlot, index) => {
                                                const formattedDate = formatDate(selectedSlot.date);
                                                const [hours] = selectedSlot.slot.startTime.split(':');
                                                const displayTime = new Date(`2000-01-01T${selectedSlot.slot.startTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

                                                return (
                                                    <div key={index} className="group bg-white/5 hover:bg-white/10 rounded-lg p-3 flex items-center justify-between transition">
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-white">{selectedSlot.courtName}</div>
                                                            <div className="text-sm text-gray-400">
                                                                {formattedDate.weekday}, {formattedDate.day} {formattedDate.month} • {displayTime}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-green-400 font-bold">₹{selectedSlot.price}</div>
                                                            <button onClick={() => removeSlot(index)} className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex gap-3 pt-4 border-t border-white/10">
                                            <button onClick={() => setSelectedSlots([])} className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition">
                                                Clear All
                                            </button>
                                            <button onClick={handleBulkCheckout} disabled={bookingLoading} className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                                {bookingLoading ? 'Processing...' : `Proceed to Pay ₹${getTotalPrice()}`}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
