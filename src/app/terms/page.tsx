'use client';

import Link from 'next/link';

export default function TermsPage() {
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
                            <img src="/logo.png" alt="SmashClub Logo" className="w-8 h-8 rounded-full object-cover border-2 border-court-green/50 bg-white" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-court-deep">Terms & Conditions</h1>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-8">Terms and Conditions</h1>

                    <div className="space-y-8 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-court-deep mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using SmashClub's services, including our website and booking facilities, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-court-deep mb-4">2. Booking Rules</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Bookings must be made in advance through our online platform.</li>
                                <li>Users must arrive at least 10 minutes before their scheduled slot.</li>
                                <li>Court usage is strictly limited to the booked time slot.</li>
                                <li>Appropriate sports attire and non-marking shoes are mandatory.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-court-deep mb-4">3. User Conduct</h2>
                            <p>
                                Users are expected to treat the facilities and staff with respect. Any damage to property or abusive behavior will result in immediate termination of membership and potential legal action.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-court-deep mb-4">4. Liability</h2>
                            <p>
                                SmashClub is not liable for any personal injury or loss of personal property that occurs on the premises. Users participate in activities at their own risk.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-court-deep mb-4">5. Membership Passes</h2>
                            <p>
                                Membership passes are non-transferable and must be used only by the registered individual. Misuse of passes may lead to cancellation without refund.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-court-deep mb-4">6. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these terms at any time. Continued use of the service following any changes constitutes acceptance of the new terms.
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
