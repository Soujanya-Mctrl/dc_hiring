import React from 'react';
import Image from 'next/image';
import { AnimatedTitleWord } from '../ui/AnimatedTitleWord';
import { Antigravity } from '../ui/Antigravity';

interface SplitLayoutProps {
  children: React.ReactNode;
}

export function SplitLayout({ children }: SplitLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-white">
      {/* Left Branding Panel */}
      <div className="relative w-full lg:w-[45%] flex flex-col p-8 lg:p-16 lg:fixed lg:h-screen lg:left-0 lg:top-0 border-r border-border/50 overflow-hidden group">
        {/* Animated Antigravity Dot Matrix Background */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.15),transparent_60%)]" />
          <Antigravity particleColor="#10b981" />
        </div>

        {/* Top Logo */}
        <div className="flex items-center gap-3 z-10 px-4 py-3">
          <Image
            src="/dcLogo.webp"
            alt="Dev Community Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="font-black text-xl tracking-wider font-mono text-white">DEV COMMUNITY-KGEC</div>
        </div>

        {/* Center Content Wrapper */}
        <div className="flex flex-col flex-1 justify-center mt-12 lg:mt-0">
          {/* Main Title */}
          <div className="mb-12 lg:mb-16 z-10 max-w-2xl pr-4">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
              We&apos;re looking for<br />
              <AnimatedTitleWord /><br />
              to shape what&apos;s next
            </h1>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-4 gap-4 z-10">
            <div>
              <div className="text-accent mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <div className="text-xl lg:text-2xl font-black">500+</div>
              <div className="text-xs text-[#737373] mt-1 font-medium">Members</div>
            </div>
            <div>
              <div className="text-accent mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
              </div>
              <div className="text-xl lg:text-2xl font-black">40+</div>
              <div className="text-xs text-[#737373] mt-1 font-medium">Countries</div>
            </div>
            <div>
              <div className="text-accent mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
              </div>
              <div className="text-xl lg:text-2xl font-black">800+</div>
              <div className="text-xs text-[#737373] mt-1 font-medium">Events</div>
            </div>
            <div>
              <div className="text-accent mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.38 8.03a6 6 0 0 0-8.56 0l-1.52 1.52a6 6 0 0 0 0 8.56l1.52 1.52a6 6 0 0 0 8.56 0l1.52-1.52a6 6 0 0 0 0-8.56l-1.52-1.52z" /><path d="M5.62 15.97a6 6 0 0 0 8.56 0l1.52-1.52a6 6 0 0 0 0-8.56l-1.52-1.52a6 6 0 0 0-8.56 0l-1.52 1.52a6 6 0 0 0 0 8.56l1.52 1.52z" /></svg>
              </div>
              <div className="text-xl lg:text-2xl font-black">∞</div>
              <div className="text-xs text-[#737373] mt-1 font-medium">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-full lg:w-[55%] lg:ml-[45%] flex flex-col min-h-screen">
        {/* Main Form Content Container */}
        <div className="flex-1 px-8 pt-12 lg:pt-16 pb-16 max-w-3xl w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
