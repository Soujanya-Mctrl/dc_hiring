import React from 'react';
import { Input } from '../ui/Input';
import { SectionHeader } from '../ui/SectionHeader';

export function Step1About() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-2">Apply to join Dev Community</h2>
        <p className="text-[#A3A3A3]">How should we reach you, and where can we find you online.</p>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-xl shadow-black/50">
        
        {/* Personal info */}
        <SectionHeader title="Personal info" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Input 
            label="Full name" 
            isRequired 
            placeholder="Your name"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          />
          <Input 
            label="Email" 
            isRequired 
            placeholder="you@example.com"
            type="email"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
          />
        </div>

        {/* Location */}
        <SectionHeader title="Location" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Input 
            label="Country" 
            isRequired 
            placeholder="Select a country"
            defaultValue="India"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>}
          />
          <Input 
            label="City" 
            placeholder="Your city"
          />
        </div>

        {/* Socials */}
        <SectionHeader title="Socials" subtitle="So we can find you in the community." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Discord" 
            isRequired 
            placeholder="username#1234"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01M15 12h.01M7.5 7.5c3.5-1 5.5-1 9 0M7 16.5c-1.5 1.5-3 2-3 2C5 12 5 8 7.5 5.5c2.5-2.5 6.5-2.5 9 0C19 8 19 12 17 18.5c0 0-1.5-.5-3-2M12 16v3M12 2v2"/></svg>}
          />
          <Input 
            label="X (Twitter)" 
            isRequired 
            placeholder="@handle"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>}
          />
          <Input 
            label="Telegram" 
            isRequired 
            placeholder="@username"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>}
          />
          <Input 
            label="GitHub" 
            placeholder="username"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>}
          />
        </div>

      </div>
    </div>
  );
}
