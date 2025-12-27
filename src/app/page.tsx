'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-rich-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-court-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-court-deep font-medium">Loading SmashClub...</p>
      </div>
    </div>
  );
}
