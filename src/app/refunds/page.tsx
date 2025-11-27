'use client';

import Link from 'next/link';

export default function RefundsPage() {
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
                            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Cancellations & Refunds</h1>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="glass-effect rounded-3xl p-8 sm:p-12 border border-white/10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Cancellations and Refunds Policy</h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">1. Booking Cancellations</h2>
                            <p className="mb-4">
                                We understand that plans can change. Our cancellation policy is designed to be fair to both players and the facility.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong className="text-white">More than 24 hours notice:</strong> Full refund credited to your original payment method.</li>
                                <li><strong className="text-white">12-24 hours notice:</strong> 50% refund credited to your account.</li>
                                <li><strong className="text-white">Less than 12 hours notice:</strong> No refund available.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">2. Refund Process</h2>
                            <p>
                                Refunds are processed within 5-7 business days. The amount will be credited back to the original payment method used during the booking. You will receive an email confirmation once the refund has been initiated.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">3. Membership Passes</h2>
                            <p>
                                Membership passes (Monthly and Yearly) are generally non-refundable once purchased. However, exceptions may be made in cases of:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Medical reasons (with valid documentation).</li>
                                <li>Relocation (proof of address change required).</li>
                                <li>Facility closure for extended periods.</li>
                            </ul>
                            <p className="mt-2">
                                In such cases, a pro-rated refund may be issued at the management's discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">4. Weather Policy</h2>
                            <p>
                                For outdoor courts, if play is impossible due to rain or severe weather conditions, a full credit will be issued for a future booking. This does not apply to indoor courts.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">5. Contact for Refunds</h2>
                            <p>
                                If you believe you are eligible for a refund or have issues with a cancellation, please contact our support team at <span className="text-purple-400">support@smashclub.com</span> or call us at <span className="text-purple-400">+91 9818559711</span>.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
                            Last updated: November 2023
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
