import React, { useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { SelectCard } from '../ui/SelectCard';
import { Textarea, Input } from '../ui/Input';

const timeCommitmentList = [
  { id: 'few', title: 'A few hours', description: '1–3 hrs/week' },
  { id: 'quite', title: 'Quite a bit', description: '3–5 hrs/week' },
  { id: 'significant', title: 'Significant time', description: '5–10 hrs/week' },
  { id: 'allin', title: 'I\'m all in', description: '10+ hrs/week' },
];

export function Step4Contribution() {
  const [time, setTime] = useState<string>('');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-2">How involved do you want to be?</h2>
        <p className="text-[#A3A3A3]">Tell us what you bring and how much time you can commit.</p>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-xl shadow-black/50 flex flex-col gap-10">
        
        <div>
          <SectionHeader 
            title="Share something you're proud of" 
            subtitle="A blog post, side project, event, design, community — paste a link or just describe it."
          />
          <Textarea 
            label="Link or description"
            isRequired
            placeholder="Paste a link, or tell us about something you're proud of..."
            className="min-h-[150px]"
          />
        </div>

        <div>
          <SectionHeader 
            title="Time you can commit" 
            subtitle="Be honest — there's room for every level."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeCommitmentList.map((item) => (
              <SelectCard
                key={item.id}
                title={item.title}
                description={item.description}
                selected={time === item.id}
                onClick={() => setTime(item.id)}
                type="radio"
              />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader title="Did somebody from Team1 refer you?" />
          <Input 
            label="Referrer name or handle (optional)"
            placeholder="e.g. @johndoe"
          />
        </div>

      </div>
    </div>
  );
}
