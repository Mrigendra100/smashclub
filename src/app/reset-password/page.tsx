'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [verifyingToken, setVerifyingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const { updatePassword } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    // Extract and verify tokens from URL on mount
    useEffect(() => {
        const verifyResetToken = async () => {
            try {
                // Debug: Log full URL
                console.log('Full URL:', window.location.href);
                console.log('Hash:', window.location.hash);
                console.log('Search:', window.location.search);

                // Check both hash and query parameters
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const queryParams = new URLSearchParams(window.location.search);

                // Check for errors first
                const error_code = hashParams.get('error_code') || queryParams.get('error_code');
                const error_description = hashParams.get('error_description') || queryParams.get('error_description');

                if (error_code || error_description) {
                    console.error('Error in URL:', { error_code, error_description });
                    setMessage({
                        type: 'error',
                        text: decodeURIComponent(error_description || 'An error occurred with the reset link.')
                    });
                    setTokenValid(false);
                    setVerifyingToken(false);
                    return;
                }

                // Check for access_token (hash fragment flow) or session
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                const type = hashParams.get('type');

                console.log('Hash params:', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken, type });

                // If we have tokens in hash, use setSession
                if (accessToken && refreshToken && type === 'recovery') {
                    console.log('Using hash token flow with setSession...');
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });

                    if (error) {
                        console.error('SetSession error:', error);
                        setMessage({
                            type: 'error',
                            text: 'Invalid or expired password reset link. Please request a new one.'
                        });
                        setTokenValid(false);
                    } else {
                        console.log('Session established successfully');
                        setTokenValid(true);
                        window.history.replaceState(null, '', window.location.pathname);
                    }
                    setVerifyingToken(false);
                    return;
                }

                // Check if Supabase already handled the auth (PKCE flow)
                // When user clicks the email link, Supabase verifies and redirects with a session
                console.log('Checking for existing session (PKCE flow)...');
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                console.log('Session check:', { hasSession: !!session, error: sessionError?.message });

                if (session?.user) {
                    // User has valid session from PKCE flow
                    console.log('Valid session found, user can reset password');
                    setTokenValid(true);
                } else {
                    // No session - this means either:
                    // 1. Direct access without clicking email link
                    // 2. Token expired
                    // 3. Redirect URL not properly configured
                    console.log('No valid session found');
                    setMessage({
                        type: 'error',
                        text: 'Invalid or expired password reset link. Please request a new one.'
                    });
                    setTokenValid(false);
                }

                setVerifyingToken(false);
            } catch (err: any) {
                console.error('Error in verifyResetToken:', err);
                setMessage({
                    type: 'error',
                    text: err.message || 'Failed to verify reset link'
                });
                setTokenValid(false);
                setVerifyingToken(false);
            }
        };

        verifyResetToken();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);

        try {
            await updatePassword(password);
            setMessage({
                type: 'success',
                text: 'Password updated successfully! Redirecting to login...'
            });
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.message || 'Failed to update password'
            });
            setLoading(false);
        }
    };

    // Show loading state while verifying token
    if (verifyingToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-rich-white p-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-court-light/50 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-court-light/50 rounded-full blur-3xl opacity-60"></div>
                </div>
                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-court-deep mb-2">SmashClub</h1>
                        <p className="text-slate-500">Verifying reset link...</p>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-court-green"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state if token is invalid
    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-rich-white p-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-court-light/50 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-court-light/50 rounded-full blur-3xl opacity-60"></div>
                </div>
                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-court-deep mb-2">SmashClub</h1>
                        <p className="text-slate-500">Password Reset</p>
                    </div>
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                        {message && (
                            <div className="border px-4 py-3 rounded-lg mb-4 bg-red-50 border-red-200 text-red-700">
                                {message.text}
                            </div>
                        )}
                        <p className="text-slate-600 text-center mb-4">
                            Please request a new password reset link to continue.
                        </p>
                        <Link
                            href="/login"
                            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-green-500/20 text-center"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-rich-white p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-court-light/50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-court-light/50 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-court-deep mb-2">SmashClub</h1>
                    <p className="text-slate-500">Set New Password</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                    {message && (
                        <div className={`border px-4 py-3 rounded-lg mb-4 ${message.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-court-green focus:border-transparent transition pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-court-green focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
