import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="SmashClub Logo" className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/50 bg-white" />
                        <span className="text-xl font-bold text-gradient">SmashClub</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                        <Link href="/contact" className="hover:text-purple-400 transition-colors">
                            Contact Us
                        </Link>
                        <Link href="/terms" className="hover:text-purple-400 transition-colors">
                            Terms & Conditions
                        </Link>
                        <Link href="/refunds" className="hover:text-purple-400 transition-colors">
                            Cancellations & Refunds
                        </Link>
                    </div>

                    <div className="text-sm text-gray-500">
                        © {new Date().getFullYear()} SmashClub. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
