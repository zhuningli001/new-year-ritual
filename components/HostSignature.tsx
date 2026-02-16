'use client';

import { CONTENT } from '@/lib/constants/content';

export default function HostSignature() {
  return (
    <div className="text-center space-y-5 py-8 md:py-12">
      <div className="relative inline-block">
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-gold-200 via-gold-300 to-gold-200 opacity-30 blur-sm rounded-lg" />
        <div className="relative text-deepRed-500 text-2xl md:text-3xl lg:text-4xl font-light tracking-wider">
          {CONTENT.host.signature}
        </div>
      </div>
      <div className="h-px w-16 md:w-20 mx-auto bg-gradient-to-r from-transparent via-charcoal-300 to-transparent" />
      <p className="text-charcoal-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light">
        {CONTENT.host.message.zh}
      </p>
    </div>
  );
}
