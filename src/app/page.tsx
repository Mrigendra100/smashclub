'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -right-1/4 w-[32rem] h-[32rem] bg-green-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-1/3 left-1/3 w-80 h-80 bg-green-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SmashClub Logo" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold text-gradient">SmashClub</span>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/login" className="text-slate-600 hover:text-green-600 transition font-medium">Login</Link>
            <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-105">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Book Your <span className="text-gradient">Badminton Court</span>
              <br />
              <span className="text-slate-700">Anytime, Anywhere</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
              India's premier badminton court booking platform. Find courts, book slots, and manage your game — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold text-lg shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <span className="relative z-10">Try Web App →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button
                onClick={() => setShowComingSoon(true)}
                className="group px-8 py-4 bg-white border-2 border-green-600 text-green-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.6 10.81L16.19 9.4a6.978 6.978 0 0 0-9.88 0L4.9 10.81C3.7 12 3.7 13.95 4.9 15.14l1.41 1.41a6.978 6.978 0 0 0 9.88 0l1.41-1.41c1.21-1.19 1.21-3.14 0-4.33M7.76 7.76c2.73-2.73 7.17-2.73 9.9 0l.71.71-9.9 9.9-.71-.71a7.04 7.04 0 0 1 0-9.9M12 5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5M6.5 17.5c0-.28.22-.5.5-.5s.5.22.5.5-.22.5-.5.5-.5-.22-.5-.5m7.42-1.86a.996.996 0 1 0 0-1.992.996.996 0 0 0 0 1.992" />
                </svg>
                Download for Android
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {/* Feature 1 */}
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-2xl hover:border-green-300 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Instant Booking</h3>
              <p className="text-slate-600 leading-relaxed">
                Book your favorite courts in seconds with real-time availability and instant confirmation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-2xl hover:border-green-300 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Secure Payments</h3>
              <p className="text-slate-600 leading-relaxed">
                Pay safely with multiple payment options including UPI, cards, and wallets.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-2xl hover:border-green-300 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Manage Bookings</h3>
              <p className="text-slate-600 leading-relaxed">
                View, manage, and track all your bookings from a single dashboard.
              </p>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">What Our Players Say</h2>
              <p className="text-xl text-slate-600">Join thousands of happy badminton enthusiasts</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-green-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">"Best badminton court in town ❤️"</p>
                <p className="text-sm font-semibold text-slate-800">Mrigendra Kumar</p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-green-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">"Best place to play badminton. Amazing owner listen to everything and provide best coaching as well. Do visit."</p>
                <p className="text-sm font-semibold text-slate-800">Smarth Devgan</p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-green-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">"Best badminton club"</p>
                <p className="text-sm font-semibold text-slate-800">Varsha Gupta</p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Visit Us</h2>
              <p className="text-xl text-slate-600">Find us at our premium facility in Ghaziabad</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Contact Info */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-green-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Smash Club</h3>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-800">Address</p>
                      <p className="text-slate-600 leading-relaxed">
                        Pasonda GZB, Plot No-821<br />
                        Shalimar Garden Extension I<br />
                        Shubham Apartment<br />
                        Sahibabad, Ghaziabad<br />
                        Uttar Pradesh 201005
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-800">Phone</p>
                      <a href="tel:09818559711" className="text-green-600 hover:text-green-700 transition font-medium">
                        098185 59711
                      </a>
                      <p className="text-sm text-slate-500 mt-1">WhatsApp available</p>
                    </div>
                  </div>

                  <a
                    href="https://share.google/AjSdUfYzK8V0Xdfnu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/20 mt-4"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-green-100 h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.5788647449987!2d77.36154367550105!3d28.675935275630894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb0e2b4c7d9f%3A0x8f5e5e5e5e5e5e5e!2sSmash%20Club!5e0!3m2!1sen!2sin!4v1704383000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>



      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowComingSoon(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.6 10.81L16.19 9.4a6.978 6.978 0 0 0-9.88 0L4.9 10.81C3.7 12 3.7 13.95 4.9 15.14l1.41 1.41a6.978 6.978 0 0 0 9.88 0l1.41-1.41c1.21-1.19 1.21-3.14 0-4.33M7.76 7.76c2.73-2.73 7.17-2.73 9.9 0l.71.71-9.9 9.9-.71-.71a7.04 7.04 0 0 1 0-9.9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Android App Coming Soon!</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We're working hard to bring you an amazing mobile experience. Meanwhile, try our web app for the full experience!
              </p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-green-500/20"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
