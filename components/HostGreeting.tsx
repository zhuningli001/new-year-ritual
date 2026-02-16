'use client';

import { CONTENT } from '@/lib/constants/content';

export default function HostGreeting() {
  return (
    <div className="text-center space-y-3 py-4">
      <div className="inline-block px-6 py-3 bg-deepRed-50 border border-deepRed-200 rounded-full">
        <p className="text-deepRed-600 text-base md:text-lg font-light leading-relaxed">
          {CONTENT.host.greeting.zh}
        </p>
      </div>
    </div>
  );
}
