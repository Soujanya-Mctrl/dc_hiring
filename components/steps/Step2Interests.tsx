import React, { useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { SelectCard } from '../ui/SelectCard';
import { Calendar, FileText, Users, Code, PenTool, BookOpen, TrendingUp, Sparkles } from 'lucide-react';

const interestsList = [
  { id: 'events', title: 'Events', description: 'Meetups, hackathons, IRL gatherings', icon: <Calendar size={20} /> },
  { id: 'content', title: 'Content', description: 'Articles, videos, threads', icon: <FileText size={20} /> },
  { id: 'community', title: 'Community', description: 'Engage and support members', icon: <Users size={20} /> },
  { id: 'development', title: 'Development', description: 'Tools, bots, dApps', icon: <Code size={20} /> },
  { id: 'design', title: 'Design', description: 'Visual identity and assets', icon: <PenTool size={20} /> },
  { id: 'research', title: 'Research', description: 'Cover projects and ecosystem news', icon: <BookOpen size={20} /> },
  { id: 'growth', title: 'Growth', description: 'Marketing and social campaigns', icon: <TrendingUp size={20} /> },
  { id: 'other', title: 'Something else', description: 'Tell us in the field below', icon: <Sparkles size={20} /> },
];

export function Step2Interests() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-2">What would you like to contribute?</h2>
        <p className="text-[#A3A3A3]">Pick wherever you&apos;d like to show up. You can do as many as you want.</p>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-xl shadow-black/50">
        <SectionHeader 
          title="What you&apos;d like to do" 
          subtitle="Pick as many as you want — nothing is locked in."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interestsList.map((interest) => (
            <SelectCard
              key={interest.id}
              title={interest.title}
              description={interest.description}
              icon={interest.icon}
              selected={selected.includes(interest.id)}
              onClick={() => toggleSelection(interest.id)}
              type="checkbox"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
