import React, { useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { SelectCard } from '../ui/SelectCard';
import { Textarea } from '../ui/Input';
import { Sparkles, Compass, Hammer, Flame } from 'lucide-react';

const familiarityList = [
  { id: 'beginner', title: 'Beginner', description: 'Just getting started', icon: <Sparkles size={20} /> },
  { id: 'familiar', title: 'Familiar', description: 'Used or explored Dev Community', icon: <Compass size={20} /> },
  { id: 'builder', title: 'Builder', description: 'Actively building or contributing', icon: <Hammer size={20} /> },
  { id: 'deep', title: 'Deep Contributor', description: 'Highly active in ecosystem', icon: <Flame size={20} /> },
];

export function Step3Experience() {
  const [familiarity, setFamiliarity] = useState<string>('');
  const [excites, setExcites] = useState('');
  const [whyJoin, setWhyJoin] = useState('');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-2">Your Dev Community journey</h2>
        <p className="text-[#A3A3A3]">No wrong answers — we welcome every level of familiarity.</p>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-xl shadow-black/50 flex flex-col gap-10">
        
        <div>
          <SectionHeader title="Familiarity with Dev Community" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familiarityList.map((item) => (
              <SelectCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                selected={familiarity === item.id}
                onClick={() => setFamiliarity(item.id)}
                type="radio"
              />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader 
            title="What excites you about Dev Community or blockchain technology right now?" 
            subtitle="A project, technology, community, or idea — anything goes."
          />
          <Textarea 
            placeholder="e.g., I love how this Dev Community lets people build their own projects..."
            value={excites}
            onChange={(e) => setExcites(e.target.value)}
            currentChars={excites.length}
            minChars={200}
          />
        </div>

        <div>
          <SectionHeader 
            title="Why do you want to be a part of Dev Community?" 
            subtitle="Tell us what draws you to the community."
          />
          <Textarea 
            placeholder="e.g., I want to grow with builders, run local events, and..."
            value={whyJoin}
            onChange={(e) => setWhyJoin(e.target.value)}
            currentChars={whyJoin.length}
            minChars={200}
          />
        </div>

      </div>
    </div>
  );
}
